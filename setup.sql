/*Initial setup of the db, probly will change and I forget to update it, sry*/
/* TODO rename columns with first letter not capitalized */
CREATE TABLE `chapters` (
    `chapterId` int NOT NULL AUTO_INCREMENT,
    `chapterName` varchar(255) DEFAULT NULL,
    `accountId` int NOT NULL DEFAULT '1',
    PRIMARY KEY (`chapterId`),
    UNIQUE KEY `uq_chapterName` (`chapterName`),
    KEY `fk_chapters_account` (`accountId`),
    CONSTRAINT `fk_chapters_account` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`)
)

CREATE TABLE `categories` (
    `categoryId` int NOT NULL AUTO_INCREMENT,
    `categoryName` varchar(255) DEFAULT NULL,
    `accountId` int NOT NULL,
    PRIMARY KEY (`categoryId`),
    UNIQUE KEY `uq_categoryName` (`categoryName`),
    KEY `fk_categories_account` (`accountId`),
    CONSTRAINT `fk_categories_account` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`)
)

CREATE TABLE `words` (
    `wordId` int NOT NULL AUTO_INCREMENT,
    `hanzi` varchar(50) DEFAULT NULL,
    `pinyin` varchar(255) DEFAULT NULL,
    `chapterId` int DEFAULT NULL,
    `typeId` int NOT NULL,
    `categoryId` int DEFAULT NULL,
    PRIMARY KEY (`wordId`),
    UNIQUE KEY `uq_hanzi_pinyin_chapterId_categoryId` (`hanzi`,`pinyin`,`chapterId`,`categoryId`),
    KEY `fk_type` (`typeId`),
    KEY `words_ibfk_1` (`chapterId`),
    KEY `words_ibfk_2` (`categoryId`),
    CONSTRAINT `fk_type` FOREIGN KEY (`typeId`) REFERENCES `wordtypes` (`TypeId`),
    CONSTRAINT `words_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`),
    CONSTRAINT `words_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`)
)

CREATE TABLE `translations` (
    `translationId` int NOT NULL AUTO_INCREMENT,
    `translation` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`translationId`),
    UNIQUE KEY `uq_translation` (`translation`)
)

CREATE TABLE `wordtranslations` (
    `wordId` int NOT NULL,
    `translationId` int NOT NULL,
    `wordTranslationId` int NOT NULL AUTO_INCREMENT,
    `accountId` int NOT NULL,
    PRIMARY KEY (`wordTranslationId`),
    UNIQUE KEY `uq_wordId_translationId` (`wordId`,`translationId`),
    KEY `fk_wordtranslations_account` (`accountId`),
    KEY `fk_translation` (`translationId`),
    CONSTRAINT `fk_translation` FOREIGN KEY (`translationId`) REFERENCES `translations` (`translationId`),
    CONSTRAINT `fk_word` FOREIGN KEY (`wordId`) REFERENCES `words` (`wordId`),
    CONSTRAINT `fk_wordtranslations_account` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`)
)

CREATE TABLE `wordtypes` (
    `typeId` int NOT NULL AUTO_INCREMENT,
    `typeName` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`typeId`),
    UNIQUE KEY `uq_typeName` (`typeName`)
)

CREATE TABLE `notes` (
    `noteId` int NOT NULL AUTO_INCREMENT,
    `noteTitle` varchar(255) NOT NULL,
    `noteContent` text NOT NULL,
    `noteExample` text,
    `accountId` int NOT NULL,
    PRIMARY KEY (`noteId`),
    UNIQUE KEY `uq_noteTitle` (`noteTitle`),
    KEY `fk_notes_account` (`accountId`),
    CONSTRAINT `fk_notes_account` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`)
)

CREATE TABLE `accounts` (
    `accountId` int NOT NULL AUTO_INCREMENT,
    `accountUsername` varchar(255) NOT NULL,
    `accountEmail` varchar(255) NOT NULL,
    `accountPassword` varchar(255) NOT NULL,
    PRIMARY KEY (`accountId`),
    UNIQUE KEY `accountUsername` (`accountUsername`),
    UNIQUE KEY `accountEmail` (`accountEmail`)
)

CREATE TABLE `aiqueries` (
    `queryId` int NOT NULL AUTO_INCREMENT,
    `accountId` int NOT NULL,
    `originalText` text NOT NULL,
    `question` text NOT NULL,
    `correctedText` text,
    `grammarFeedback` json DEFAULT NULL,
    `vocabularyFeedback` json DEFAULT NULL,
    `explanation` json DEFAULT NULL,
    `answer` json DEFAULT NULL,
    `score` int DEFAULT NULL,
    PRIMARY KEY (`queryId`),
    KEY `accountId` (`accountId`),
    CONSTRAINT `aiqueries_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`)
)