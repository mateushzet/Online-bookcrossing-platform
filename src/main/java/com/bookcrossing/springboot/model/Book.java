package com.bookcrossing.springboot.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private int bookId;
    private String title;
    private String author;
    private String isbn;
    private String genre;
    @Column(name = "added_by")
    private int addedBy;
    @Column(name = "physical_description")
    private String physicalDescription;
    @Column(name = "subject_headings")
    private String subjectHeadings;
    @Column(name = "publisher")
    private String corporateNames;
    @Column(name = "personal_names")
    private String personalNames;
    @Column(name = "series_statements")
    private String seriesStatements;
    @Column(name = "general_notes")
    private String generalNotes;
    private String summary;
    @Column(name = "table_of_contents")
    private String tableOfContents;
    @Column(name = "language_code")
    private String languageCode;
    @Column(name = "original_language")
    private String originalLanguage;
    @Column(name = "publication_year")
    private String publicationYear;


    public Book(String title, String author, String isbn, String genre, int addedBy) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.addedBy = addedBy;
    }

}