package com.proyecto.uade.dieteticaYuyo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;
import com.proyecto.uade.dieteticaYuyo.repository.UserRepository;;

@Service
public class ServiceUserImpl implements ServiceUser{
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getUsers(){
        return (ArrayList<User>) userRepository.findAll();
    }
    @Override
    public Optional<User> getUserById(Long userId){
        return userRepository.findById(userId);
    }
    @Override
    public User findByUsername(String userName){
        return userRepository.findByUsername(userName);
    }
    @Override
    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    @Override
    public ResponseEntity<User> updateUser(User user){
        Optional<User> existingUser = userRepository.findById(user.getId());

        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();
            userToUpdate.setSurname(user.getSurname());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setPassword(user.getPassword());
            userToUpdate.setDireccion(user.getDireccion());
            userToUpdate.setImg(user.getImg());

            User updatedUser = userRepository.save(userToUpdate);

            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @Override
    public User createUser(User user) throws UserDuplicateException{
        User userCreate=userRepository.save(user);
        return userCreate;
    }
    @Override
    public ResponseEntity<String> deleteUserById(Long id){
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("El usuario ya fue borrado.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe el usuario.");
        }
    }
}
