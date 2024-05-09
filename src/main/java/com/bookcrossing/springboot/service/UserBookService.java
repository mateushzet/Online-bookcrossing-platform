package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.model.Book;
import com.bookcrossing.springboot.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
}