package com.clinic.app.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("${api.endpoint.version}")
@Validated
public class AddDataIntoDatabaseController {

    private static final Logger logger = LoggerFactory.getLogger(AddDataIntoDatabaseController.class);

    @PostMapping(value = "/addDataIntoDatabase")
    public ResponseEntity<?> addDataIntoDatabase() {
        return ResponseEntity.ok().body("result is success add to database");
    }

}
