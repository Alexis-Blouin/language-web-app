/*Initial setup of the db, probly will change and I forget to update it, sry*/
CREATE TABLE `chapters` (
    `ChapterID` int NOT NULL AUTO_INCREMENT,
    `ChapterName` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`ChapterID`),
    UNIQUE KEY `ChapterName` (`ChapterName`)
)

CREATE TABLE `words` (
    `WordID` int NOT NULL AUTO_INCREMENT,
    `Hanzi` varchar(50) DEFAULT NULL,
    `Pinyin` varchar(255) DEFAULT NULL,
    `ChapterID` int DEFAULT NULL,
    `TypeID` int NOT NULL,
    PRIMARY KEY (`WordID`),
    UNIQUE KEY `Hanzi` (`Hanzi`,`Pinyin`,`ChapterID`),
    KEY `ChapterID` (`ChapterID`),
    KEY `fk_type` (`TypeID`),
    CONSTRAINT `fk_type` FOREIGN KEY (`TypeID`) REFERENCES `wordtypes` (`TypeID`),
    CONSTRAINT `words_ibfk_1` FOREIGN KEY (`ChapterID`) REFERENCES `chapters` (`ChapterID`)
)

CREATE TABLE `translations` (
    `TranslationID` int NOT NULL AUTO_INCREMENT,
    `Translation` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`TranslationID`),
    UNIQUE KEY `Meaning` (`Translation`)
)

CREATE TABLE `wordtranslations` (
    `WordID` int NOT NULL,
    `TranslationID` int NOT NULL,
    `WordTranslationID` int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`WordTranslationID`),
    UNIQUE KEY `WordID` (`WordID`,`TranslationID`),
    KEY `fk_translation` (`TranslationID`),
    CONSTRAINT `fk_translation` FOREIGN KEY (`TranslationID`) REFERENCES `translations` (`TranslationID`),
    CONSTRAINT `fk_word` FOREIGN KEY (`WordID`) REFERENCES `words` (`WordID`)
)

CREATE TABLE `wordtypes` (
    `TypeID` int NOT NULL AUTO_INCREMENT,
    `TypeName` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`TypeID`),
    UNIQUE KEY `TypeName` (`TypeName`)
)
