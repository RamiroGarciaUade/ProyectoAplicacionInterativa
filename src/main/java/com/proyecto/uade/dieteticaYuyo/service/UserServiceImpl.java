package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.Role;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserNotFoundException;
import com.proyecto.uade.dieteticaYuyo.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) throws UserNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Override
    public User getUserByEmail(String email) throws UserNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public User createUser(String email, String password, String firstName, String lastName, String address, String imageUrl) throws UserDuplicateException {
        if (userRepository.existsByEmail(email)) {
            throw new UserDuplicateException(email);
        }
        return userRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .address(address)
                .imageUrl(imageUrl)
                .role(Role.USER)
                .build());
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public User updateUser(Long id, String email, String password, String firstName, String lastName, String address, String imageUrl) throws UserDuplicateException {
        User user = getUserById(id);
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new UserDuplicateException(email);
        }

        user.setEmail(email);
        if (!user.getPassword().equals(password)) {
            user.setPassword(passwordEncoder.encode(password));
        }
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAddress(address);
        user.setImageUrl(imageUrl);

        return userRepository.save(user);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deleteUserById(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

}
