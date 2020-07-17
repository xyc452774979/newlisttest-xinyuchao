package com.xinyuchao.repository;

import com.xinyuchao.entity.ChengengUser;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface ChungengUserRepository {
    public List<ChengengUser> findAll(ChengengUser user);
    public ChengengUser findById(String id);
    public int save(ChengengUser user);
    public int update(ChengengUser user);
    public int deleteById(String id);
}
