-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.28-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for procedure battleshipgamedb.CheckWinner
DELIMITER //
CREATE PROCEDURE `CheckWinner`()
BEGIN
    DECLARE player1_ships INT;
    DECLARE player2_ships INT;

    -- Count the remaining ships for each player.
    SELECT COUNT(*) INTO player1_ships
    FROM player_board
    WHERE player_id = 1 AND has_ship = TRUE;

    SELECT COUNT(*) INTO player2_ships
    FROM player_board
    WHERE player_id = 2 AND has_ship = TRUE;

    -- Update the game status if there's a winner.
    IF player1_ships = 0 THEN
        UPDATE game_status
        SET game_status = 'completed', winner_id = 2
        WHERE game_id = 1;
    ELSEIF player2_ships = 0 THEN
        UPDATE game_status
        SET game_status = 'completed', winner_id = 1
        WHERE game_id = 1;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure battleshipgamedb.GameOver
DELIMITER //
CREATE PROCEDURE `GameOver`()
BEGIN
    -- Update the game status.
    UPDATE game_status
    SET game_status = 'completed', winner_id = winner_id
    WHERE game_id = 1;

    -- Calculate scores (simplified logic).
    UPDATE players
    SET player_score = player_score + 1
    WHERE player_id = winner_id;

    -- Save game results (if needed).
    -- This part can involve additional logic to store game history.
END//
DELIMITER ;

-- Dumping structure for table battleshipgamedb.game_status
CREATE TABLE IF NOT EXISTS `game_status` (
  `game_id` int(11) NOT NULL AUTO_INCREMENT,
  `player_turn` int(11) NOT NULL DEFAULT 1,
  `game_status` enum('not_active','initialized','started','ongoing','ended','aborted') NOT NULL DEFAULT 'not_active',
  `winner_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`game_id`),
  KEY `FK__players` (`player_turn`),
  KEY `FK__players_2` (`winner_id`),
  CONSTRAINT `FK__players` FOREIGN KEY (`player_turn`) REFERENCES `players` (`player_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__players_2` FOREIGN KEY (`winner_id`) REFERENCES `players` (`player_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table battleshipgamedb.game_status: ~0 rows (approximately)

-- Dumping structure for procedure battleshipgamedb.InitializeGame
DELIMITER //
CREATE PROCEDURE `InitializeGame`()
BEGIN
    -- Assuming that player boards and ships are already set up.
    UPDATE game_status
    SET game_status = 'ongoing', player_turn = 1
    WHERE game_id = 1;
END//
DELIMITER ;

-- Dumping structure for table battleshipgamedb.player2_board
CREATE TABLE IF NOT EXISTS `player2_board` (
  `player_id` int(11) NOT NULL,
  `x_coordinate` char(1) NOT NULL,
  `y_coordinate` int(11) NOT NULL,
  `has_ship` tinyint(1) DEFAULT 0,
  `is_hit` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`player_id`,`x_coordinate`,`y_coordinate`),
  CONSTRAINT `player2_board_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table battleshipgamedb.player2_board: ~0 rows (approximately)

-- Dumping structure for table battleshipgamedb.players
CREATE TABLE IF NOT EXISTS `players` (
  `player_id` int(11) NOT NULL AUTO_INCREMENT,
  `player_name` varchar(100) NOT NULL DEFAULT 'Player1',
  `player_score` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table battleshipgamedb.players: ~0 rows (approximately)

-- Dumping structure for procedure battleshipgamedb.PlayerTurn
DELIMITER //
CREATE PROCEDURE `PlayerTurn`()
BEGIN
    DECLARE is_hit BOOLEAN;

    -- Check if it's a hit or miss (simplified logic).
    SELECT has_ship INTO is_hit
    FROM player_board
    WHERE player_id = player_id AND x_coordinate = x_coord AND y_coordinate = y_coord;

    -- Update player's board.
    UPDATE player_board
    SET is_hit = TRUE
    WHERE player_id = player_id AND x_coordinate = x_coord AND y_coordinate = y_coord;

    -- Update opponent's board.
    UPDATE opponent_board
    SET has_ship = is_hit
    WHERE player_id = player_id AND x_coordinate = x_coord AND y_coordinate = y_coord;

    -- Switch player's turn in the game status.
    UPDATE game_status
    SET player_turn = CASE WHEN player_turn = 1 THEN 2 ELSE 1 END
    WHERE game_id = 1;
END//
DELIMITER ;

-- Dumping structure for table battleshipgamedb.player_board
CREATE TABLE IF NOT EXISTS `player_board` (
  `player_id` int(11) NOT NULL,
  `x_coordinate` char(1) NOT NULL,
  `y_coordinate` int(11) NOT NULL,
  `has_ship` tinyint(1) DEFAULT 0,
  `is_hit` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`player_id`,`x_coordinate`,`y_coordinate`),
  CONSTRAINT `player_board_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table battleshipgamedb.player_board: ~0 rows (approximately)

-- Dumping structure for procedure battleshipgamedb.RecordHit
DELIMITER //
CREATE PROCEDURE `RecordHit`()
BEGIN
    -- Record a hit on the opponent's board.
    UPDATE opponent_board
    SET has_ship = TRUE
    WHERE player_id = player_id AND x_coordinate = x_coord AND y_coordinate = y_coord;

    -- Check if a ship has been sunk (simplified logic).
    IF (SELECT COUNT(*) FROM opponent_board WHERE player_id = player_id AND has_ship = FALSE) = 0 THEN
        CALL CheckWinner();
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure battleshipgamedb.RecordMiss
DELIMITER //
CREATE PROCEDURE `RecordMiss`()
BEGIN
    -- Record a miss on the opponent's board.
    UPDATE opponent_board
    SET has_ship = FALSE
    WHERE player_id = player_id AND x_coordinate = x_coord AND y_coordinate = y_coord;
END//
DELIMITER ;

-- Dumping structure for procedure battleshipgamedb.ResetGame
DELIMITER //
CREATE PROCEDURE `ResetGame`()
BEGIN
    -- Clear player boards.
    DELETE FROM player_board WHERE player_id IN (1, 2);

    -- Reset the game status.
    UPDATE game_status
    SET game_status = 'pending', winner_id = NULL
    WHERE game_id = 1;
END//
DELIMITER ;

-- Dumping structure for procedure battleshipgamedb.RetrieveGameState
DELIMITER //
CREATE PROCEDURE `RetrieveGameState`(
	OUT `player1_board_resultset` VARCHAR(2048),
	OUT `player2_board_resultset` VARCHAR(2048),
	OUT `current_turn` INT,
	OUT `game_status` ENUM('not active', 'initialized', 'started', 'on going', 'ended', 'aborded')
)
BEGIN
	-- Retrieve player boards and game status as JSON strings.
    SET player1_board_resultset = (
        SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('x_coordinate', x_coordinate, 'y_coordinate', y_coordinate, 'has_ship', has_ship, 'is_hit', is_hit)), ']')
        FROM player_board
        WHERE player_id = 1
    );

    SET player2_board_resultset = (
        SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('x_coordinate', x_coordinate, 'y_coordinate', y_coordinate, 'has_ship', has_ship, 'is_hit', is_hit)), ']')
        FROM player_board
        WHERE player_id = 2
    );

    SELECT player_turn, game_status INTO current_turn, game_status
    FROM game_status
    WHERE game_id = 1;
END//
DELIMITER ;

-- Dumping structure for table battleshipgamedb.ships
CREATE TABLE IF NOT EXISTS `ships` (
  `ship_id` int(11) NOT NULL AUTO_INCREMENT,
  `ship_name` varchar(255) NOT NULL,
  `ship_length` int(5) NOT NULL,
  PRIMARY KEY (`ship_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table battleshipgamedb.ships: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
