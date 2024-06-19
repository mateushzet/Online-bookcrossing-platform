package com.bookcrossing.springboot.repository;

import com.bookcrossing.springboot.dto.AcceptedExchangesDTO;
import com.bookcrossing.springboot.model.AcceptedExchanges;
import com.bookcrossing.springboot.model.AcceptedExchangesId;
import com.bookcrossing.springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AcceptedExchangesRepository extends JpaRepository<AcceptedExchanges, AcceptedExchangesId> {

    @Query("SELECT new com.bookcrossing.springboot.dto.AcceptedExchangesDTO(" +
            "a.id.exchangeId, a.id.ownerId, a.id.requesterId, a.stageOwner, a.stageRequester, e.bookImage)" +
            "FROM AcceptedExchanges a " +
            "JOIN a.exchange e " +
            "WHERE a.id.requesterId = :requesterId")
    List<AcceptedExchangesDTO> findByIdRequesterId(int requesterId);

    @Query("SELECT a FROM AcceptedExchanges a WHERE a.id.exchangeId = :exchangeId AND a.id.requesterId = :requesterId AND a.id.ownerId = :ownerId")
    AcceptedExchanges findAcceptedExchangesByExchangeIdAndRequesterIdAndOwnerId(@Param("exchangeId") int exchangeId, @Param("requesterId") int requesterId, @Param("ownerId") int ownerId);

    @Query("SELECT DISTINCT u FROM User u WHERE (u.userId IN (SELECT ae.id.requesterId FROM AcceptedExchanges ae WHERE ae.id.exchangeId = :exchangeId AND ae.id.ownerId = :userId) " +
            "OR u.userId IN (SELECT ae.id.ownerId FROM AcceptedExchanges ae WHERE ae.id.exchangeId = :exchangeId AND ae.id.requesterId = :userId) " +
            "OR u.userId = :ownerId) AND u.userId <> :userId")
    List<User> findParticipantsByExchangeId(@Param("exchangeId") Long exchangeId, @Param("userId") int userId, @Param("ownerId") Long ownerId);

    @Modifying
    @Transactional
    @Query("UPDATE AcceptedExchanges a SET a.starsOwner = :rating WHERE a.id.exchangeId = :exchangeId AND a.id.ownerId = :ownerId AND a.id.requesterId = :requesterId")
    void updateOwnerRating(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId, @Param("requesterId") int requesterId, @Param("rating") int rating);

    @Modifying
    @Transactional
    @Query("UPDATE AcceptedExchanges a SET a.starsRequester = :rating WHERE a.id.exchangeId = :exchangeId AND a.id.ownerId = :ownerId AND a.id.requesterId = :requesterId")
    void updateRequesterRating(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId, @Param("requesterId") int requesterId, @Param("rating") int rating);

    @Modifying
    @Transactional
    @Query("UPDATE AcceptedExchanges a SET a.stageOwner = :stage WHERE a.id.exchangeId = :exchangeId AND a.id.ownerId = :ownerId AND a.id.requesterId = :requesterId")
    void updateOwnerStage(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId, @Param("requesterId") int requesterId, @Param("stage") int stage);

    @Modifying
    @Transactional
    @Query("UPDATE AcceptedExchanges a SET a.stageRequester = :stage WHERE a.id.exchangeId = :exchangeId AND a.id.ownerId = :ownerId AND a.id.requesterId = :requesterId")
    void updateRequesterStage(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId, @Param("requesterId") int requesterId, @Param("stage") int stage);

    @Modifying
    @Transactional
    @Query("DELETE FROM AcceptedExchanges ae WHERE ae.id.exchangeId = :exchangeId AND ae.id.ownerId = :ownerId AND ae.id.requesterId = :requesterId")
    void deleteByExchangeIdAndUserIdAndOwnerId(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId, @Param("requesterId") int requesterId);

    @Modifying
    @Transactional
    @Query("DELETE FROM AcceptedExchanges ae WHERE ae.id.exchangeId = :exchangeId AND ae.id.ownerId = :ownerId")
    void deleteByExchangeIdAndOwnerId(@Param("exchangeId") int exchangeId, @Param("ownerId") int ownerId);

    @Query("SELECT COALESCE((a.starsRequester),0) FROM AcceptedExchanges a WHERE a.id.ownerId = :userId AND a.starsRequester <> 0 ")
    List<Double> getUserRatingOwner(@Param("userId") int userId);

    @Query("SELECT COALESCE((a.starsOwner),0) FROM AcceptedExchanges a WHERE a.id.requesterId = :userId AND a.starsOwner <> 0 ")
    List<Double> getUserRatingRequester(@Param("userId") int userId);




}
