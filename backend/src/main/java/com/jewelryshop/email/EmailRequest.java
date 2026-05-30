package com.jewelryshop.email;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest {

    @NotBlank
    private String to;

    @NotBlank
    private String subject;

    @NotBlank
    private String templateName;

    @Builder.Default
    private Map<String, Object> variables = Collections.emptyMap();
}
