package com.bookcrossing.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookDTO {
    private Integer bookId;
    private String title;
    private String author;
    private String isbn;
    private String genre;
    private Integer addedBy;
    private String physicalDescription;
    private String subjectHeadings;
    private String corporateNames;
    private String personalNames;
    private String seriesStatements;
    private String generalNotes;
    private String summary;
    private String tableOfContents;
    private String languageCode;
    private String originalLanguage;
    private String publicationYear;

    public BookDTO(int bookId, String title, String author, String isbn, String genre) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
    }

    public BookDTO(int bookId, String title, String author, String isbn, String genre, int addedBy) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.addedBy = addedBy;
    }

    public BookDTO(int bookId, String title, String author, String isbn, String genre, int addedBy, String physicalDescription,
                   String subjectHeadings, String corporateNames, String personalNames, String seriesStatements, String generalNotes,
                   String summary, String tableOfContents, String languageCode, String originalLanguage, String publicationYear) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.addedBy = addedBy;
        this.physicalDescription = physicalDescription;
        this.subjectHeadings = subjectHeadings;
        this.corporateNames = corporateNames;
        this.personalNames = personalNames;
        this.seriesStatements = seriesStatements;
        this.generalNotes = generalNotes;
        this.summary = summary;
        this.tableOfContents = tableOfContents;
        this.languageCode = languageCode;
        this.originalLanguage = originalLanguage;
        this.publicationYear = publicationYear;
    }

    public BookDTO() {
    }
}
