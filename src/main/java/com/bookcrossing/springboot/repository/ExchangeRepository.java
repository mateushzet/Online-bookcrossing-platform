package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.model.Exchange;
import com.bookcrossing.springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    @Query("SELECT new com.bookcrossing.springboot.dto.CombinedBookExchangeDTO(" +
            "e.exchangeId, e.bookId, e.ownerId, e.description, e.bookCondition, " +
            "b.title, b.author, b.isbn, b.genre, u.username, e.bookImage) " +
            "FROM Exchange e " +
            "JOIN e.book b " +
            "JOIN e.user u " +
            "WHERE e.ownerId <> :userId AND e.exchangeId NOT IN (SELECT ae.id.exchangeId FROM AcceptedExchanges ae " +
            "WHERE ae.id.exchangeId = e.exchangeId AND ae.id.requesterId = :userId )")
    List<CombinedBookExchangeDTO> findAllBookExchanges(@Param("userId") int userId);

    @Query("SELECT new com.bookcrossing.springboot.dto.CombinedBookExchangeDTO(" +
            "e.exchangeId, e.bookId, e.ownerId, e.description, e.bookCondition, " +
            "b.title, b.author, b.isbn, b.genre, u.username) " +
            "FROM Exchange e " +
            "JOIN e.user u " +
            "JOIN e.book b WHERE e.ownerId = :ownerId" )
    List<CombinedBookExchangeDTO> findAllExchangeByOwnerId(int ownerId);

    List<Exchange> findByExchangeId(int exchangeId);

}
