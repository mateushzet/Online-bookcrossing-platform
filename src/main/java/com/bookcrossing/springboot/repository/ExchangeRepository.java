package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.dto.MatchingExchangeDTO;
import com.bookcrossing.springboot.model.Exchange;
import com.bookcrossing.springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {

    @Query("SELECT new com.bookcrossing.springboot.dto.CombinedBookExchangeDTO(" +
            "e.exchangeId, e.bookId, e.ownerId, " +
            "e.preferredBooksDescription, e.bookCondition, " +
            "e.bookImage, e.exchangeDescription, " +
            "e.preferredBooks, " +
            "b.title, b.author, b.isbn, b.genre, " +
            "u.username, u.lat, u.lng) " +
            "FROM Exchange e " +
            "JOIN e.book b " +
            "JOIN e.user u " +
            "WHERE e.ownerId <> :userId AND e.exchangeId NOT IN " +
            "(SELECT ae.id.exchangeId FROM AcceptedExchanges ae WHERE ae.id.exchangeId = e.exchangeId AND ae.id.requesterId = :userId)")
    List<CombinedBookExchangeDTO> findAllBookExchanges(@Param("userId") int userId);

    @Query("SELECT new com.bookcrossing.springboot.dto.CombinedBookExchangeDTO(" +
            "e.exchangeId, e.bookId, e.ownerId, e.exchangeDescription, e.bookCondition, " +
            "b.title, b.author, b.isbn, b.genre, u.username, e.preferredBooks, e.preferredBooksDescription, e.bookImage) " +
            "FROM Exchange e " +
            "JOIN e.user u " +
            "JOIN e.book b WHERE e.ownerId = :ownerId" )
    List<CombinedBookExchangeDTO> findAllExchangeByOwnerId(int ownerId);

    List<Exchange> findByExchangeId(int exchangeId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Exchange e WHERE e.exchangeId = :exchangeId AND e.ownerId = :ownerId")
    void deleteByExchangeIdAndOwnerId(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId);

    @Query("SELECT e.exchangeId, e.bookId, e.ownerId, e.bookCondition, e.preferredBooks, e.bookImage FROM Exchange e WHERE e.exchangeId = :exchangeId")
    List<Object[]> findExchangeDetails(@Param("exchangeId") Long exchangeId);

    @Query("SELECT e.exchangeId, e.bookId, e.ownerId, e.bookCondition, u.username, b.title, b.author, b.genre, u.username, e.preferredBooks FROM Exchange e JOIN e.book b JOIN e.user u")
    List<Object[]> findAllExchangeDetails();

    @Query("SELECT e.exchangeId, e.bookId, e.ownerId, e.bookCondition, e.preferredBooks, e.bookImage, b.title FROM Exchange e JOIN e.book b WHERE e.exchangeId = :exchangeId")
    List<Object[]> findExchangeDetailsExtended(@Param("exchangeId") Long exchangeId);

}
