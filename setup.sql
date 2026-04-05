/*Initial setup of the db, probly will change and I forget to update it, sry*/
CREATE TABLE `chapters` (
    `ChapterId` int NOT NULL AUTO_INCREMENT,
    `ChapterName` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`ChapterId`),
    UNIQUE KEY `ChapterName` (`ChapterName`)
)

CREATE TABLE `words` (
    `WordId` int NOT NULL AUTO_INCREMENT,
    `Hanzi` varchar(50) DEFAULT NULL,
    `Pinyin` varchar(255) DEFAULT NULL,
    `ChapterId` int DEFAULT NULL,
    `TypeId` int NOT NULL,
    PRIMARY KEY (`WordId`),
    UNIQUE KEY `Hanzi` (`Hanzi`,`Pinyin`,`ChapterId`),
    KEY `ChapterId` (`ChapterId`),
    KEY `fk_type` (`TypeId`),
    CONSTRAINT `fk_type` FOREIGN KEY (`TypeId`) REFERENCES `wordtypes` (`TypeId`),
    CONSTRAINT `words_ibfk_1` FOREIGN KEY (`ChapterId`) REFERENCES `chapters` (`ChapterId`)
)

CREATE TABLE `translations` (
    `TranslationId` int NOT NULL AUTO_INCREMENT,
    `Translation` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`TranslationId`),
    UNIQUE KEY `Meaning` (`Translation`)
)

CREATE TABLE `wordtranslations` (
    `WordId` int NOT NULL,
    `TranslationId` int NOT NULL,
    `WordTranslationId` int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`WordTranslationId`),
    UNIQUE KEY `WordId` (`WordId`,`TranslationId`),
    KEY `fk_translation` (`TranslationId`),
    CONSTRAINT `fk_translation` FOREIGN KEY (`TranslationId`) REFERENCES `translations` (`TranslationId`),
    CONSTRAINT `fk_word` FOREIGN KEY (`WordId`) REFERENCES `words` (`WordId`)
)

CREATE TABLE `wordtypes` (
    `TypeId` int NOT NULL AUTO_INCREMENT,
    `TypeName` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`TypeId`),
    UNIQUE KEY `TypeName` (`TypeName`)
)
