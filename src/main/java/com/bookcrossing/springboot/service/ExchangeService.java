package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.model.AcceptedExchanges;
import com.bookcrossing.springboot.model.AcceptedExchangesId;
import com.bookcrossing.springboot.model.Exchange;
import com.bookcrossing.springboot.repository.AcceptedExchangesRepository;
import com.bookcrossing.springboot.repository.BookRepository;
import com.bookcrossing.springboot.repository.ExchangeRepository;
import com.bookcrossing.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExchangeService {

    ExchangeRepository exchangeRepository;
    UserRepository userRepository;
    BookRepository bookRepository;
    AcceptedExchangesRepository acceptedExchangesRepository;

    @Autowired
    public ExchangeService(ExchangeRepository exchangeRepository, UserRepository userRepository, AcceptedExchangesRepository acceptedExchangesRepository, BookRepository bookRepository) {
        this.exchangeRepository = exchangeRepository;
        this.userRepository = userRepository;
        this.acceptedExchangesRepository = acceptedExchangesRepository;
        this.bookRepository = bookRepository;
    }

    public boolean submitExchange (int bookId, String description, int ownerID, String bookCondition, byte[] bookImage){
        try{
            Exchange exchange = new Exchange(bookId, description, ownerID, bookCondition, bookImage);
            exchangeRepository.save(exchange);
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public List<CombinedBookExchangeDTO> getAllExchanges (int userId){
        return exchangeRepository.findAllBookExchanges(userId);
    }

    public List<CombinedBookExchangeDTO> getMyExchanges (int ownerId){
        return exchangeRepository.findAllExchangeByOwnerId(ownerId);
    }

    public void acceptExchange (int exchangeId, int userId, int ownerID){
        AcceptedExchanges acceptedExchange = new AcceptedExchanges(new AcceptedExchangesId(exchangeId, userId, ownerID), 1,1);
        acceptedExchangesRepository.save(acceptedExchange);
    }

    public void cancelExchange (int exchangeId, int ownerID, int selectedUser, int userId){
        if(ownerID == userId) acceptedExchangesRepository.deleteByExchangeIdAndUserIdAndOwnerId(exchangeId, ownerID, selectedUser);
        else acceptedExchangesRepository.deleteByExchangeIdAndUserIdAndOwnerId(exchangeId, ownerID, userId);
    }

    public List<CombinedBookExchangeDTO> findAcceptedExchanges(int requesterId) {

        List<AcceptedExchanges> exchanges = acceptedExchangesRepository.findByIdRequesterId(requesterId);

        return exchanges.stream().map(exchange -> {
            CombinedBookExchangeDTO dto = new CombinedBookExchangeDTO();
            dto.setExchangeId(exchange.getId().getExchangeId());
            dto.setOwnerId(exchange.getId().getOwnerId());
            dto.setStageOwner(exchange.getStageOwner());
            dto.setStageRequester(exchange.getStageRequester());

            // Pobierz dodatkowe informacje dotyczące wymiany
            exchangeRepository.findByExchangeId(exchange.getId().getExchangeId()).forEach(exchangeDetails -> {
                dto.setExchangeDescription(exchangeDetails.getDescription());
                dto.setBookCondition(exchangeDetails.getBookCondition());

                // Pobierz informacje o książce
                bookRepository.findById((long) exchangeDetails.getBookId()).ifPresent(book -> {
                    dto.setBookId(book.getBookId());
                    dto.setTitle(book.getTitle());
                    dto.setAuthor(book.getAuthor());
                    dto.setIsbn(book.getIsbn());
                    dto.setGenre(book.getGenre());
                });
            });

            return dto;
        }).collect(Collectors.toList());
    }


    public AcceptedExchanges getExchangeDetails (int exchangeId, int requesterId, int ownerID){
          return acceptedExchangesRepository.findAcceptedExchangesByExchangeIdAndRequesterIdAndOwnerId(exchangeId, requesterId, ownerID);
    }

    public void updateRating (int exchangeId, int ownerId, int selectedUser, int rating, int userId){
        System.out.println( exchangeId +"|"+ ownerId +"|"+ selectedUser +"|"+ rating +"|"+ userId);
       if(ownerId == userId) acceptedExchangesRepository.updateOwnerRating(exchangeId, ownerId, selectedUser, rating);
        else acceptedExchangesRepository.updateRequesterRating(exchangeId, ownerId, userId, rating);
    }

    public void updateStage (int exchangeId, int ownerId, int selectedUser, int stage, int userId){
        if(ownerId == userId) acceptedExchangesRepository.updateOwnerStage(exchangeId, ownerId, selectedUser, stage);
        else acceptedExchangesRepository.updateRequesterStage(exchangeId, ownerId, userId, stage);
    }

    public double getUserRating(int userId) {
        List<Double> ratingOwner = acceptedExchangesRepository.getUserRatingOwner(userId);
        List<Double> ratingRequester = acceptedExchangesRepository.getUserRatingRequester(userId);

        List<Double> allRatings = new ArrayList<>();
        allRatings.addAll(ratingOwner);
        allRatings.addAll(ratingRequester);

        if (allRatings.isEmpty()) {
            return 0.0;
        } else {
            double sum = 0;
            for (double rating : allRatings) {
                sum += rating;
            }
            return sum / allRatings.size();
        }
    }
}
