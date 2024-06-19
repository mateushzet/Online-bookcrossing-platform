package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
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

    @Query(value = "SELECT e2.exchangeId AS matching_exchange_id, b2.title AS matching_title, b2.author AS matching_author, e2.book_condition AS matching_condition, b2.genre AS matching_genre, e2.owner_id AS matching_owner_id, u2.username AS matching_owner_username, e1.exchange_id AS original_exchange_id, b1.title AS original_title, b1.author AS original_author, e1.book_condition AS original_condition, b1.genre AS original_genre, e1.owner_id AS original_owner_id, u1.username AS original_owner_username " +
            "FROM Exchange e1 " +
            "JOIN Books b1 ON e1.book_id = b1.book_id " +
            "JOIN Exchange e2 ON e1.exchange_id != e2.exchange_id " +
            "JOIN Books b2 ON e2.book_id = b2.book_id " +
            "JOIN Users u1 ON e1.owner_id = u1.user_id " +
            "JOIN Users u2 ON e2.owner_id = u2.user_id " +
            "WHERE e2.owner_id != e1.owner_id " +
            "AND e1.exchange_id = :exchangeId " +
            "AND e1.book_id = ANY (string_to_array(e2.preferred_books, ',')::int[])",
            nativeQuery = true)
    List<Object[]> findMatchingExchanges(@Param("exchangeId") Long exchangeId);

    @Query(value = "SELECT e2.exchange_id AS matching_exchange_id, b2.title AS matching_title, b2.author AS matching_author, e2.book_condition AS matching_condition, b2.genre AS matching_genre, e2.owner_id AS matching_owner_id, u2.username AS matching_owner_username, e1.exchange_id AS original_exchange_id, b1.title AS original_title, b1.author AS original_author, e1.book_condition AS original_condition, b1.genre AS original_genre, e1.owner_id AS original_owner_id, u1.username AS original_owner_username " +
            "FROM exchange e1 " +
            "JOIN books b1 ON e1.book_id = b1.book_id " +
            "JOIN exchange e2 ON e1.exchange_id != e2.exchange_id " +
            "JOIN books b2 ON e2.book_id = b2.book_id " +
            "JOIN users u1 ON e1.owner_id = u1.user_id " +
            "JOIN users u2 ON e2.owner_id = u2.user_id " +
            "WHERE e2.owner_id != e1.owner_id " +
            "AND e1.exchange_id = :exchangeId " +
            "AND e2.book_id = ANY (string_to_array(e1.preferred_books, ',')::int[])",
            nativeQuery = true)
    List<Object[]> findReverseMatchingExchanges(@Param("exchangeId") Long exchangeId);

}
