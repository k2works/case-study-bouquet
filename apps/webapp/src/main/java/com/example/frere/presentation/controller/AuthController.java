package com.example.frere.presentation.controller;

import com.example.frere.application.exception.DuplicateEmailException;
import com.example.frere.application.service.AuthService;
import com.example.frere.application.service.RegisterCommand;
import com.example.frere.presentation.dto.RegisterRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute RegisterRequest registerRequest, Model model) {
        try {
            RegisterCommand command = new RegisterCommand(
                    registerRequest.getEmail(),
                    registerRequest.getPassword(),
                    registerRequest.getName(),
                    registerRequest.getPhone(),
                    registerRequest.getAddress()
            );
            authService.register(command);
            return "redirect:/login?registered";
        } catch (DuplicateEmailException e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("registerRequest", registerRequest);
            return "register";
        }
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }
}
