package com.xinyuchao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChengengUser {
    private String id;
    private String username;
    private String chinesename;
    private String path;
    private String level;
    private String status;
    private String creatdate;
    private String deleteflag;
    private String state;
}
