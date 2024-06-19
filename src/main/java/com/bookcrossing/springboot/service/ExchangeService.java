package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.AcceptedExchangesDTO;
import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.dto.MatchingExchangeDTO;
import com.bookcrossing.springboot.model.AcceptedExchanges;
import com.bookcrossing.springboot.model.AcceptedExchangesId;
import com.bookcrossing.springboot.model.Book;
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

    public boolean submitExchange (int bookId, String preferredBooksDescription, int ownerID, String bookCondition, String exchangeDescription, String preferredBooks, byte[] bookImage){
        try{
            Exchange exchange = new Exchange(bookId, preferredBooksDescription, ownerID, bookCondition.trim(), exchangeDescription, preferredBooks, bookImage);
            exchangeRepository.save(exchange);
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public List<CombinedBookExchangeDTO> getAllExchanges(int userId) {
        List<CombinedBookExchangeDTO> exchanges = exchangeRepository.findAllBookExchanges(userId);

        for (CombinedBookExchangeDTO dto : exchanges) {
            List<BookDTO> preferredBooksList = new ArrayList<>();
            String preferredBooks = dto.getPreferredBooks();

            if (preferredBooks != null && !preferredBooks.isEmpty()) {
                String[] bookIds = preferredBooks.split(",");
                for (String bookId : bookIds) {
                    try {
                        long id = Long.parseLong(bookId.trim());
                        Book book = bookRepository.findById(id).orElse(null);
                        if (book != null) {
                            preferredBooksList.add(new BookDTO(book.getBookId(), book.getTitle(), book.getAuthor(), book.getIsbn(), book.getGenre()));
                        }
                    } catch (NumberFormatException e) {
                    }
                }
            }

            dto.setPreferredBooksList(preferredBooksList);
        }

        return exchanges;
    }

    public List<CombinedBookExchangeDTO> getMyExchanges(int ownerId) {
        List<CombinedBookExchangeDTO> exchanges = exchangeRepository.findAllExchangeByOwnerId(ownerId);

        for (CombinedBookExchangeDTO dto : exchanges) {
            List<BookDTO> preferredBooksList = new ArrayList<>();
            String preferredBooks = dto.getPreferredBooks();

            if (preferredBooks != null && !preferredBooks.isEmpty()) {
                String[] bookIds = preferredBooks.split(",");
                for (String bookId : bookIds) {
                    try {
                        long id = Long.parseLong(bookId.trim());
                        Book book = bookRepository.findById(id).orElse(null);
                        if (book != null) {
                            preferredBooksList.add(new BookDTO(book.getBookId(), book.getTitle(), book.getAuthor(), book.getIsbn(), book.getGenre()));
                        }
                    } catch (NumberFormatException e) {
                    }
                }
            }

            dto.setPreferredBooksList(preferredBooksList);
        }

        return exchanges;
    }

    public void acceptExchange(int exchangeId, int userId, int ownerID) {
        AcceptedExchanges acceptedExchange = new AcceptedExchanges(new AcceptedExchangesId(exchangeId, userId, ownerID), 1, 1);
        acceptedExchangesRepository.save(acceptedExchange);
    }

    public void cancelExchange(int exchangeId, int ownerID, int selectedUser, int userId) {
        if (ownerID == userId)
            acceptedExchangesRepository.deleteByExchangeIdAndUserIdAndOwnerId(exchangeId, ownerID, selectedUser);
        else
            acceptedExchangesRepository.deleteByExchangeIdAndUserIdAndOwnerId(exchangeId, ownerID, userId);
    }

    public boolean deleteExchange(int exchangeId, int ownerID, int userId) {
        if (ownerID == userId) {
            acceptedExchangesRepository.deleteByExchangeIdAndOwnerId(exchangeId, ownerID);
            exchangeRepository.deleteByExchangeIdAndOwnerId(exchangeId, ownerID);
            return true;
        } else return false;
    }

    public List<CombinedBookExchangeDTO> findAcceptedExchanges(int requesterId) {

        List<AcceptedExchangesDTO> exchanges = acceptedExchangesRepository.findByIdRequesterId(requesterId);

        return exchanges.stream().map(exchange -> {
            CombinedBookExchangeDTO dto = new CombinedBookExchangeDTO();
            dto.setExchangeId(exchange.getExchangeId());
            dto.setOwnerId(exchange.getOwnerId());
            dto.setStageOwner(exchange.getStageOwner());
            dto.setStageRequester(exchange.getStageRequester());
            dto.setBookImage(exchange.getBookImage());
            dto.setOwnerName(userRepository.findUserDTOByUserId(exchange.getOwnerId()).getUsername());

            exchangeRepository.findByExchangeId(exchange.getExchangeId()).forEach(exchangeDetails -> {
                dto.setExchangeDescription(exchangeDetails.getExchangeDescription());
                dto.setPreferredBooksDescription(exchangeDetails.getPreferredBooksDescription());
                dto.setBookCondition(exchangeDetails.getBookCondition());

                bookRepository.findById((long) exchangeDetails.getBookId()).ifPresent(book -> {
                    dto.setBookId(book.getBookId());
                    dto.setTitle(book.getTitle());
                    dto.setAuthor(book.getAuthor());
                    dto.setIsbn(book.getIsbn());
                    dto.setGenre(book.getGenre());
                });

                List<BookDTO> preferredBooksList = new ArrayList<>();
                String preferredBooks = exchangeDetails.getPreferredBooks();
                if (preferredBooks != null && !preferredBooks.isEmpty()) {
                    String[] bookIds = preferredBooks.split(",");
                    for (String bookId : bookIds) {
                        try {
                            long id = Long.parseLong(bookId.trim());
                            Book book = bookRepository.findById(id).orElse(null);
                            if (book != null) {
                                preferredBooksList.add(new BookDTO(book.getBookId(), book.getTitle(), book.getAuthor(), book.getIsbn(), book.getGenre()));
                            }
                        } catch (NumberFormatException e) {

                        }
                    }
                }
                dto.setPreferredBooksList(preferredBooksList);
            });

            return dto;
        }).collect(Collectors.toList());
    }

    public AcceptedExchanges getExchangeDetails(int exchangeId, int requesterId, int ownerID) {
        return acceptedExchangesRepository.findAcceptedExchangesByExchangeIdAndRequesterIdAndOwnerId(exchangeId, requesterId, ownerID);
    }

    public void updateRating(int exchangeId, int ownerId, int selectedUser, int rating, int userId) {
        System.out.println(exchangeId + "|" + ownerId + "|" + selectedUser + "|" + rating + "|" + userId);
        if (ownerId == userId)
            acceptedExchangesRepository.updateOwnerRating(exchangeId, ownerId, selectedUser, rating);
        else
            acceptedExchangesRepository.updateRequesterRating(exchangeId, ownerId, userId, rating);
    }

    public void updateStage(int exchangeId, int ownerId, int selectedUser, int stage, int userId) {
        if (ownerId == userId)
            acceptedExchangesRepository.updateOwnerStage(exchangeId, ownerId, selectedUser, stage);
        else
            acceptedExchangesRepository.updateRequesterStage(exchangeId, ownerId, userId, stage);
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

    public List<MatchingExchangeDTO> getMatchingExchanges(Long exchangeId) {
        List<Object[]> results = exchangeRepository.findMatchingExchanges(exchangeId);
        return transformToDTO(results);
    }

    public List<MatchingExchangeDTO> getReverseMatchingExchanges(Long exchangeId) {
        List<Object[]> results = exchangeRepository.findReverseMatchingExchanges(exchangeId);
        return transformToDTO(results);
    }

    private List<MatchingExchangeDTO> transformToDTO(List<Object[]> results) {
        List<MatchingExchangeDTO> dtoList = new ArrayList<>();
        for (Object[] result : results) {
            MatchingExchangeDTO dto = new MatchingExchangeDTO();
            dto.setMatchingExchangeId((Long) result[0]);
            dto.setMatchingTitle((String) result[1]);
            dto.setMatchingAuthor((String) result[2]);
            dto.setMatchingCondition((String) result[3]);
            dto.setMatchingGenre((String) result[4]);
            dto.setMatchingOwnerId((Long) result[5]);
            dto.setMatchingOwnerUsername((String) result[6]);
            dto.setOriginalExchangeId((Long) result[7]);
            dto.setOriginalTitle((String) result[8]);
            dto.setOriginalAuthor((String) result[9]);
            dto.setOriginalCondition((String) result[10]);
            dto.setOriginalGenre((String) result[11]);
            dto.setOriginalOwnerId((Long) result[12]);
            dto.setOriginalOwnerUsername((String) result[13]);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
