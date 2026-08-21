package com.example.Government.subsidy.Project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
// Required for the @Scheduled reminder/overdue jobs in
// DisbursementSchedulerService to actually run - without this,
// @Scheduled methods are just plain methods that never get invoked.
@EnableScheduling
public class GovernmentSubsidyProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(GovernmentSubsidyProjectApplication.class, args);
	}

}
