package com.xinyuchao.controller;

import com.xinyuchao.entity.ChengengUser;
import com.xinyuchao.repository.ChungengUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class userHandler {
    @Autowired
    private ChungengUserRepository chungengUserRepository;

    @GetMapping("/index")
    public String index(){
        return "index";
    }
    @PostMapping("/userList")
    @ResponseBody
    public List<ChengengUser> userList(ChengengUser user){
        List<ChengengUser> list = chungengUserRepository.findAll(user);
        return list;
    }

    @RequestMapping("/save")
    @ResponseBody
    public Map<String,String> save(@RequestBody ChengengUser user){
        if(user.getState()!=null &&"add".equals(user.getState()) ){
            user.setDeleteflag("0");
            chungengUserRepository.save(user);
        }else{
            chungengUserRepository.update(user);
        }
        Map<String,String> map = new HashMap<String, String>();
        map.put("message","保存成功");
        return map;
    }

    @RequestMapping("/deleteById/{id}")
    @ResponseBody
    public Map<String,String> deleteById(@PathVariable("id") String id){
        chungengUserRepository.deleteById(id);
        Map<String,String> map = new HashMap<String, String>();
        map.put("message","删除成功");
        return map;
    }


}
