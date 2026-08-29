package com.example.Government.subsidy.Project.Controller;

import com.example.Government.subsidy.Project.Service.DisbursementSchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Manual triggers for the two @Scheduled jobs so they can be tested in
 * Postman without waiting for 9 AM / 10 AM. Guarded by app.dev-mode
 * (see application.properties) - set it to false, or remove this
 * property override, before deploying to production so these routes
 * return 404 there.
 */
@RestController
@RequestMapping("/disbursement/test")
@CrossOrigin(origins = "*")
public class DisbursementTestController {

    @Autowired
    private DisbursementSchedulerService schedulerService;

    @Value("${app.dev-mode:true}")
    private boolean devMode;

    // GET /disbursement/test/run-reminder-check
    @GetMapping("/run-reminder-check")
    public ResponseEntity<String> runReminderCheck() {
        if (!devMode) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(schedulerService.sendUpcomingReminders());
    }

    // GET /disbursement/test/run-overdue-check
    @GetMapping("/run-overdue-check")
    public ResponseEntity<String> runOverdueCheck() {
        if (!devMode) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(schedulerService.flagOverdueMilestones());
    }
}
