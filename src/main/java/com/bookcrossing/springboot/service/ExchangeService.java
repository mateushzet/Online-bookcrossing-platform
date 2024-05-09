package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.dto.CombinedBookExchangeDTO;
import com.bookcrossing.springboot.model.Exchange;
import com.bookcrossing.springboot.model.User;
import com.bookcrossing.springboot.repository.ExchangeRepository;
import com.bookcrossing.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExchangeService {

    ExchangeRepository exchangeRepository;
    UserRepository userRepository;

    @Autowired
    public ExchangeService(ExchangeRepository exchangeRepository, UserRepository userRepository) {
        this.exchangeRepository = exchangeRepository;
        this.userRepository = userRepository;
    }

    public boolean submitExchange (int bookId, String description, String username, String bookCondition){

        try{
            User user = userRepository.findByUsername(username);
            int ownerID = user.getUserId();
            Exchange exchange = new Exchange(bookId, description, ownerID, bookCondition);
            exchangeRepository.save(exchange);
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public List<CombinedBookExchangeDTO> getAllExchanges (){
        return exchangeRepository.findAllBookExchanges();
    }
}
