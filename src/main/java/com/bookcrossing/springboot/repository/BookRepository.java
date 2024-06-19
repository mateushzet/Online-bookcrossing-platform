package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.Book;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT new com.bookcrossing.springboot.dto.BookDTO(b.bookId, b.title, b.author, b.isbn, b.genre, b.addedBy, " +
            "b.physicalDescription, b.subjectHeadings, b.corporateNames, b.personalNames, b.seriesStatements, " +
            "b.generalNotes, b.summary, b.tableOfContents, b.languageCode, b.originalLanguage, b.publicationYear) FROM Book b")
    List<BookDTO> findAllBook();

    @Query("SELECT new com.bookcrossing.springboot.dto.BookDTO(b.bookId, b.title, b.author, b.isbn, b.genre) " +
            "FROM Book b " +
            "WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) " +
            "AND LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))" +
            "AND LOWER(b.isbn) LIKE LOWER(CONCAT('%', :isbn, '%'))" +
            "AND LOWER(b.genre) LIKE LOWER(CONCAT('%', :genre, '%'))")
    List<BookDTO> findByTitleOrAuthorContainingIgnoreCase(
            @Param("title") String title,
            @Param("author") String author,
            @Param("isbn") String isbn,
            @Param("genre") String genre,
            Pageable pageable);

    List<Book> findByTitleAndAuthor(String title, String Author);

    void deleteByBookId(int bookId);

}