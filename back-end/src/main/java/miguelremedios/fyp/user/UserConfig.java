package miguelremedios.fyp.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class UserConfig {
    @Bean
    CommandLineRunner UserCommandLineRunner(UserRepository repository) {
        return args -> {
            User user1 = new User(
                "qLaOt4F3XYdrltdnSsYXqE27Dbj1",
                "miguelremady@gmail.com",
                "MiguelRemedios",
                "",
                "");

            repository.saveAll(List.of(user1));
        };
    }
}
