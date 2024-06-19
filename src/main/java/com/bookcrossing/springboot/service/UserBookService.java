package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.dto.UserDTO;
import com.bookcrossing.springboot.model.Book;
import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserBookService {

    private final BookRepository bookRepository;

    @Autowired
    public UserBookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookDTO> getAllBook() {
        return bookRepository.findAllBook();
    }

    public List<BookDTO> findTop5ByTitleContainingIgnoreCase(String title, String author, String isbn, String genre) {

        System.out.println(title+" "+author+" "+ isbn+" "+genre);
        Pageable limit = PageRequest.of(0, 8);
        return bookRepository.findByTitleOrAuthorContainingIgnoreCase(title, author, isbn, genre, limit);
    }

    public boolean addBook(Book book){
        List<Book> books = bookRepository.findByTitleAndAuthor(book.getTitle(), book.getAuthor());
        if(books.isEmpty()){
            bookRepository.save(book);
            return true;
        }else{
            return false;
        }
    }

    @Transactional
    public void deleteBook(int bookId){
        bookRepository.deleteByBookId(bookId);
    }

    @Transactional
    public void modifyBook(BookDTO bookDTO) {
        Book book = bookRepository.findById((long)bookDTO.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with id " + bookDTO.getBookId()));

        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setIsbn(bookDTO.getIsbn());
        book.setGenre(bookDTO.getGenre());
        book.setAddedBy(bookDTO.getAddedBy());
        book.setPhysicalDescription(bookDTO.getPhysicalDescription());
        book.setSubjectHeadings(bookDTO.getSubjectHeadings());
        book.setCorporateNames(bookDTO.getCorporateNames());
        book.setPersonalNames(bookDTO.getPersonalNames());
        book.setSeriesStatements(bookDTO.getSeriesStatements());
        book.setGeneralNotes(bookDTO.getGeneralNotes());
        book.setSummary(bookDTO.getSummary());
        book.setTableOfContents(bookDTO.getTableOfContents());
        book.setLanguageCode(bookDTO.getLanguageCode());
        book.setOriginalLanguage(bookDTO.getOriginalLanguage());
        book.setPublicationYear(bookDTO.getPublicationYear());

        bookRepository.save(book);
    }
}