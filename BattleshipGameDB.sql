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

-- Dumping structure for table battleshipgamedb.board_empty1
CREATE TABLE IF NOT EXISTS `board_empty1` (
  `match_id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `p1_choice` char(10) DEFAULT NULL,
  PRIMARY KEY (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table battleshipgamedb.board_empty1: ~0 rows (approximately)
INSERT INTO `board_empty1` (`match_id`, `p1_choice`) VALUES
	(1, NULL);

-- Dumping structure for table battleshipgamedb.board_empty2
CREATE TABLE IF NOT EXISTS `board_empty2` (
  `match_id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `p2_choice` char(10) DEFAULT NULL,
  PRIMARY KEY (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table battleshipgamedb.board_empty2: ~0 rows (approximately)
INSERT INTO `board_empty2` (`match_id`, `p2_choice`) VALUES
	(1, NULL);

-- Dumping structure for procedure battleshipgamedb.clean_boards
DELIMITER //
CREATE PROCEDURE `clean_boards`()
BEGIN
      TRUNCATE TABLE player1_board;
      REPLACE INTO player1_board SELECT * FROM board_empty1;
      
      TRUNCATE TABLE player2_board;
      REPLACE INTO player2_board SELECT * FROM board_empty2;
      
      UPDATE players SET username=NULL, token=NULL, last_action=NULL;
      UPDATE game_status SET status='not active', player_turn=NULL, result_text=NULL ,result=NULL;
END//
DELIMITER ;

-- Dumping structure for table battleshipgamedb.game_status
CREATE TABLE IF NOT EXISTS `game_status` (
  `status` enum('not active','initialized','started','ended','aborted') NOT NULL DEFAULT 'not active',
  `player_turn` enum('p1','p2') DEFAULT NULL,
  `result` enum('p1','p2') DEFAULT NULL,
  `result_text` char(50) DEFAULT NULL,
  `last_change` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table battleshipgamedb.game_status: ~2 rows (approximately)
INSERT INTO `game_status` (`status`, `player_turn`, `result`, `result_text`, `last_change`) VALUES
	('not active', NULL, NULL, NULL, '2023-11-21 11:39:00');

-- Dumping structure for table battleshipgamedb.player1_board
CREATE TABLE IF NOT EXISTS `player1_board` (
  `match_id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `p1_choice` char(10) DEFAULT NULL,
  PRIMARY KEY (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table battleshipgamedb.player1_board: ~0 rows (approximately)
INSERT INTO `player1_board` (`match_id`, `p1_choice`) VALUES
	(1, NULL);

-- Dumping structure for table battleshipgamedb.player2_board
CREATE TABLE IF NOT EXISTS `player2_board` (
  `match_id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `p2_choice` char(10) DEFAULT NULL,
  PRIMARY KEY (`match_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table battleshipgamedb.player2_board: ~0 rows (approximately)
INSERT INTO `player2_board` (`match_id`, `p2_choice`) VALUES
	(1, NULL);

-- Dumping structure for table battleshipgamedb.players
CREATE TABLE IF NOT EXISTS `players` (
  `username` varchar(50) DEFAULT NULL,
  `player_number` enum('p1','p2') NOT NULL,
  `token` varchar(100) NOT NULL,
  `last_action` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table battleshipgamedb.players: ~2 rows (approximately)
INSERT INTO `players` (`username`, `player_number`, `token`, `last_action`) VALUES
	(NULL, 'p1', '', NULL),
	(NULL, 'p2', '', NULL);

-- Dumping structure for procedure battleshipgamedb.play_again
DELIMITER //
CREATE PROCEDURE `play_again`()
BEGIN
    If (SELECT `status` FROM `game_status`) LIKE 'ended' THEN        
		  UPDATE `game_status` SET `player_turn`=(SELECT result FROM `game_status`);
		  
		  TRUNCATE TABLE player1_board;
        REPLACE INTO `player1_board` SELECT * FROM `board_empty1`;
        UPDATE `player1_board` SET `p1_choice`=NULL, `p2_choice`=NULL, `winner`=NULL WHERE match_id=1;
        
        TRUNCATE TABLE player2_board;
        REPLACE INTO `player2_board` SELECT * FROM `board_empty2`;
        UPDATE `player2_board` SET `p1_choice`=NULL, `p2_choice`=NULL, `winner`=NULL WHERE match_id=1;
        
        UPDATE `game_status` SET `status`='started', `result`=NULL;
    END IF;      
END//
DELIMITER ;

-- Dumping structure for trigger battleshipgamedb.game_status_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `game_status_update` BEFORE UPDATE ON `game_status` FOR EACH ROW BEGIN
   SET NEW.last_change=NOW();
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;