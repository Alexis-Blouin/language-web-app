/*Initial setup of the db, probly will change and I forget to update it, sry*/
create table Chapters (
	ChapterID int NOT NULL AUTO_INCREMENT,
    ChapterName varchar(255),
    primary key (ChapterID)
);

create table Words (
	WordID int NOT NULL AUTO_INCREMENT,
	Hanzi varchar(50),
    Pinyin varchar(255),
    ChapterID int,
    primary key (WordID),
    foreign key (ChapterID) references Chapters(ChapterID)
);

create table Translations (
    TranslationID int NOT NULL AUTO_INCREMENT,
    Meaning varchar(255),
    primary key (TranslationID)
);

create table WordTranslations (
    WordID int,
    TranslationID int,
    primary key (WordID, TranslationID),
    foreign key (WordID) references Words(WordID),
    foreign key (TranslationID) references Translations(TranslationID)
);