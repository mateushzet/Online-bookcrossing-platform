package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.model.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    @Query("SELECT new com.bookcrossing.springboot.dto.CombinedBookExchangeDTO(" +
            "e.exchangeId, e.bookId, e.ownerId, e.description, e.bookCondition, " +
            "b.title, b.author, b.isbn, b.genre) " +
            "FROM Exchange e " +
            "JOIN e.book b")
    List<CombinedBookExchangeDTO> findAllBookExchanges();

}
