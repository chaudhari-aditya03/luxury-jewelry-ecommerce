package com.jewelryshop.email;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailResponse {

    private boolean success;
    private String provider;
    private String message;
    private String providerMessageId;
    private int statusCode;
}
