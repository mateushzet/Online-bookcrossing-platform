package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.AcceptedExchangesDTO;
import com.bookcrossing.springboot.dto.BookDTO;
import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.dto.MatchingExchangeDTO;
import com.bookcrossing.springboot.model.*;
import com.bookcrossing.springboot.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExchangeService {

    ExchangeRepository exchangeRepository;
    UserRepository userRepository;
    BookRepository bookRepository;
    AcceptedExchangesRepository acceptedExchangesRepository;
    NotificationRepository notificationRepository;

    @Autowired
    public ExchangeService(ExchangeRepository exchangeRepository, UserRepository userRepository, AcceptedExchangesRepository acceptedExchangesRepository, BookRepository bookRepository, NotificationRepository notificationRepository) {
        this.exchangeRepository = exchangeRepository;
        this.userRepository = userRepository;
        this.acceptedExchangesRepository = acceptedExchangesRepository;
        this.bookRepository = bookRepository;
        this.notificationRepository = notificationRepository;
    }

    public boolean submitExchange(int bookId, String preferredBooksDescription, int ownerID, String bookCondition,
                                  String exchangeDescription, String preferredBooks, byte[] bookImage) {
        try {
            // Save exchange in the database
            Exchange exchange = new Exchange(bookId, preferredBooksDescription, ownerID, bookCondition.trim(),
                                    exchangeDescription, preferredBooks, bookImage);

            Exchange savedExchange = exchangeRepository.save(exchange);

            // Find matching exchanges and create notifications
            try {
                List<MatchingExchangeDTO> matchingExchanges = findMatchingExchanges((long) savedExchange.getExchangeId());
                createNotificationsBasedOnMatches(matchingExchanges);

            } catch (Exception e) {
                System.err.println("Error finding matching exchanges or creating notifications: " + e.getMessage());
                e.printStackTrace();
            }
        } catch (Exception e) {
            System.err.println("Error saving exchange: " + e.getMessage());
            e.printStackTrace();
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
        sendNotification(userId, "Twoja oferta wymiany została zaakceptowana przez użytkownika " + userRepository.findUserDTOByUserId(ownerID).getUsername());
    }

    private void sendNotification(int userId, String message) {
        Notification notification = new Notification();
        notification.setUserId((long)userId);
        notification.setMessage(message);
        notification.setRead(false);
        notificationRepository.save(notification);
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

        String[] stages = {"Negocjacje", "W trakcie wymiany", "Zakończono"};
        List<Object[]> exchangeDetailsList = exchangeRepository.findExchangeDetailsExtended((long)exchangeId);

        Object[] exchangeDetails = exchangeDetailsList.get(0);
        String bookTitle = (String) exchangeDetails[6];

        if (ownerId == userId){
            acceptedExchangesRepository.updateOwnerStage(exchangeId, ownerId, selectedUser, stage);
            createNotification(selectedUser, "Status wymiany dla książki '"+bookTitle+"' został zaktualizowany na: " + stages[stage-1]);
        }
        else {
            acceptedExchangesRepository.updateRequesterStage(exchangeId, ownerId, userId, stage);
            createNotification(ownerId, "Status wymiany dla książki '"+bookTitle+"' został zaktualizowany na: " + stages[stage-1]);
        }
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

    public List<MatchingExchangeDTO> findMatchingExchanges(Long exchangeId) {
        // Fetch the details of the exchange with the given ID
        List<Object[]> exchangeDetailsList = exchangeRepository.findExchangeDetailsExtended(exchangeId);
        if (exchangeDetailsList.isEmpty()) {
            return Collections.emptyList();
        }

        Object[] exchangeDetails = exchangeDetailsList.get(0);
        Integer bookId = (Integer) exchangeDetails[1];
        Integer ownerId = (Integer) exchangeDetails[2];
        String preferredBooks = (String) exchangeDetails[4];
        String bookTitle = (String) exchangeDetails[6];

        // Fetch all exchanges
        List<Object[]> allExchanges = exchangeRepository.findAllExchangeDetails();

        // Find matching exchanges
        List<MatchingExchangeDTO> matchingExchanges = new ArrayList<>();
        for (Object[] exchange : allExchanges) {
            Integer otherExchangeBookId = (Integer) exchange[1];
            Integer otherOwnerId = (Integer) exchange[2];
            String otherPreferredBooks = (String) exchange[9];

            // Check if the bookId is in the preferredBooks of the other exchange
            if (!ownerId.equals(otherOwnerId) && otherPreferredBooks.contains(String.valueOf(bookId))) {
                // Add to matching exchanges
                MatchingExchangeDTO matchingExchange1 = new MatchingExchangeDTO(
                        (Integer) exchange[0], // original exchangeId
                        ownerId, // original ownerId
                        (String) exchange[4], // original username
                        bookTitle, // original book title
                        (String) exchange[6], // original book author
                        (String) exchange[3], // original book condition
                        (String) exchange[7], // original book genre
                        (Integer) exchange[0], // matching exchangeId
                        otherOwnerId, // matching ownerId
                        (String) exchange[4], // matching username
                        (String) exchange[5], // matching book title
                        (String) exchange[6], // matching book author
                        (String) exchange[3], // matching book condition
                        (String) exchange[7]  // matching book genre

                );
                matchingExchange1.setNotificationType(1);
                matchingExchanges.add(matchingExchange1);
            }

                if (!ownerId.equals(otherOwnerId) && preferredBooks.contains(String.valueOf(otherExchangeBookId))) {
                    // Add to matching exchanges
                    MatchingExchangeDTO matchingExchange2 = new MatchingExchangeDTO(
                            (Integer) exchange[0], // original exchangeId
                            ownerId, // original ownerId
                            (String) exchange[4], // original username
                            bookTitle, // original book title
                            (String) exchange[6], // original book author
                            (String) exchange[3], // original book condition
                            (String) exchange[7], // original book genre
                            (Integer) exchange[0], // matching exchangeId
                            otherOwnerId, // matching ownerId
                            (String) exchange[4], // matching username
                            (String) exchange[5], // matching book title
                            (String) exchange[6], // matching book author
                            (String) exchange[3], // matching book condition
                            (String) exchange[7]  // matching book genre

                    );
                    matchingExchange2.setNotificationType(2);
                    matchingExchanges.add(matchingExchange2);
            }
        }
        return matchingExchanges;
    }

    private void createNotification(int userId, String message) {
        Notification notification = new Notification();
        notification.setUserId((long)userId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public void saveNotification(Notification notification) {
        boolean exists = notificationRepository.existsByUserIdAndMessage(notification.getUserId(), notification.getMessage());

        if (!exists) {
            notificationRepository.save(notification);
        } else {
        }
    }

    private void createNotificationsBasedOnMatches(List<MatchingExchangeDTO> matchingExchanges) {
        for (MatchingExchangeDTO match : matchingExchanges) {
            if (match.getNotificationType() == 1) {
                // Create notification for the owner of the original exchange
                Notification notification1 = new Notification();
                notification1.setUserId((long) match.getMatchingOwnerId());

                List<Object[]> exchangeDetailsList = exchangeRepository.findExchangeDetailsExtended((long) match.getMatchingExchangeId());
                Object[] exchangeDetails = exchangeDetailsList.get(0);
                String bookTitle = (String) exchangeDetails[6];

                notification1.setMessage("Użytkownik " + userRepository.findUserDTOByUserId(match.getOriginalOwnerId()).getUsername()
                        + " poszukuje książki którą oferujesz: " + match.getMatchingBookTitle());
                saveNotification(notification1);

                Notification notification2 = new Notification();
                notification2.setUserId((long) match.getOriginalOwnerId());
                notification2.setMessage("Użytkownik " + userRepository.findUserDTOByUserId(match.getMatchingOwnerId()).getUsername()
                        + " poszukuje książki którą oferujesz: " + match.getOriginalBookTitle());
                saveNotification(notification2);
            }

            if (match.getNotificationType() == 2) {
                // Create notification for the owner of the matching exchange
                Notification notification3 = new Notification();
                notification3.setUserId((long) match.getMatchingOwnerId());
                notification3.setMessage("Użytkownik " + userRepository.findUserDTOByUserId(match.getOriginalOwnerId()).getUsername()
                        + " oferuje książkę której szukasz: " + match.getOriginalBookTitle());
                saveNotification(notification3);

                Notification notification4 = new Notification();
                notification4.setUserId((long) match.getOriginalOwnerId());
                notification4.setMessage("Użytkownik " + userRepository.findUserDTOByUserId(match.getMatchingOwnerId()).getUsername()
                        + " oferuje książkę której szukasz: " + match.getMatchingBookTitle());
                saveNotification(notification4);
            }
        }
    }

}
