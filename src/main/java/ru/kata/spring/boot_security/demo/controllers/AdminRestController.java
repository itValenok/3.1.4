package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.configs.util.UserNotCreateExcaption;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class AdminRestController {
    UserService userService;
    RoleService roleService;
    private Logger logger = LoggerFactory.getLogger(AdminRestController.class);

    @Autowired
    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("getAllUsers");
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id) {
        logger.info("getUserById");
        User user = userService.getUserById(id);
        if(user == null) {
            throw new UserNotCreateExcaption("User with id " + id + " not found");
        } else {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
    }
    @PostMapping("/users")
    public ResponseEntity<HttpStatus> createUser(@RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            bindingResult.getFieldErrors().forEach(fieldError -> {
                errors.append(fieldError.getField()).append(": ").append(fieldError.getDefaultMessage()).append("\n");
            });
            logger.error(errors.toString());
            throw new UserNotCreateExcaption(errors.toString());
        }
        logger.info("createUser");
        userService.addUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PutMapping("/users")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            bindingResult.getFieldErrors().forEach(fieldError -> {
                errors.append(fieldError.getField()).append(": ").append(fieldError.getDefaultMessage()).append("\n");
            });
            logger.error(errors.toString());
            throw new UserNotCreateExcaption(errors.toString());
        }
        logger.info("updateUser");
        userService.updateUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable long id) {
        if(userService.getUserById(id) == null) {
            logger.error("user with id " + id + " not found");
            throw new UserNotCreateExcaption("User not found");
        } else {
            logger.info("deleteUser");
            userService.deleteUserById(id);
            return ResponseEntity.ok(HttpStatus.OK);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUser(Principal principal) {
        logger.info("getUser");
        return new ResponseEntity<>(userService.getUserByUsername(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        logger.info("getAllRoles");
        return new ResponseEntity<>(roleService.findAll(), HttpStatus.OK);
    }

    @ExceptionHandler
    public ResponseEntity<UserNotCreateExcaption> handleException(UserNotCreateExcaption ex) {
        UserNotCreateExcaption response = new UserNotCreateExcaption(
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
