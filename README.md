# newlisttest-xinyuchao
springboot实例
SpringBoot+Mybatis+mysql+thymeleaf的整合简单实现
mysql导入sql文件。
/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 13/07/2020 22:49:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chungeng_user
-- ----------------------------
DROP TABLE IF EXISTS `chungeng_user`;
CREATE TABLE `chungeng_user`  (
  `id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `chinesename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `level` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `creatdate` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chungeng_user
-- ----------------------------
INSERT INTO `chungeng_user` VALUES ('2', '3213', '老王', '212', '1', '33', '2020-07-15 00:00:00');

SET FOREIGN_KEY_CHECKS = 1;


项目文件结构如下

1.创建springboot项目，添加pom依赖。
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.1.6.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
        <version>2.1.6.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.8</version>
    </dependency>

    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>1.3.1</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.15</version>
    </dependency>
</dependencies>

2.在resources文件夹下创建配置文件application.yml，添加 MySQL 数据源信息以及 MyBatis 的相关配置。
spring:
  thymeleaf:
    prefix: classpath:/templates/     #模版路径
    suffix: .html                     #模版后缀
    servlet:
      content-type: text/html         #设置Content-type
    encoding: UTF-8                   #编码方式
    mode: HTML5                       #校验HTML5格式
    cache: false                      #关闭缓存，在开发过程中可立即看到页面修改结果
  datasource:
    url: jdbc:mysql://localhost:3306/test?serverTimezone=UTC&useUnicode=true&characterEncoding=UTF-8
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
mybatis:
  mapper-locations: classpath:/mapping/*.xml
  type-aliases-package: com.xinyuchao.entity
mvc:
  hiddenmethod:
    filter:
      enabled: true

3.创建实体类entity。
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

4.创建ChungengUserRepository，定义基本的 CRUD 接口。
@Mapper
public interface ChungengUserRepository {
    public List<ChengengUser> findAll(ChengengUser user);
    public ChengengUser findById(String id);
    public int save(ChengengUser user);
    public int update(ChengengUser user);
    public int deleteById(String id);
}



5.在 /resources/mapping 路径下创建 ChungengUserRepository.xml，作为ChungengUserRepository的配套 Mapper 文件，定义每个接口方法对应的 SQL 语句以及结果集解析策略。
<mapper namespace="com.xinyuchao.repository.ChungengUserRepository">

    <select id="findAll" resultType="ChengengUser">
        select * from chungeng_user
        <where>
            <if test="id != null and id != ''">
                and id = #{id}
            </if>
            <if test="username != null and username != ''">
                and username like concat('%',#{username},'%')
            </if>
            <if test="chinesename != null and chinesename != ''">
                and chinesename like concat('%',#{chinesename},'%')
            </if>
        </where>
    </select>

    <select id="findById" parameterType="java.lang.String" resultType="ChengengUser">
        select * from chungeng_user where id = #{id}
    </select>

    <insert id="save" parameterType="ChengengUser">
        insert into chungeng_user(id,username,chinesename,path,level,status,creatdate)
        values(#{id},#{username},#{chinesename},#{path},#{level},#{status},#{creatdate})
    </insert>

    <update id="update" parameterType="ChengengUser">
        update chungeng_user set username = #{username},chinesename = #{chinesename},path = #{path},
        level = #{level},status = #{status},creatdate = #{creatdate} where id = #{id}
    </update>

    <delete id="deleteById" parameterType="java.lang.String">
        delete from chungeng_user where id = #{id}
    </delete>

</mapper>

6.创建userHandler ,注入 ChungengUserRepository。
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

7.创建启动类Application。 
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class,args);
    }
}

8.在/resources/static/miniui/下添加miniui相关js文件，具体请参考源代码。

9.在 /resources/templates下创建index.html。
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<html lang="en">

<script th:src="@{/miniui/boot.js}" type="text/javascript" charset="utf-8"></script>

<head>
    <meta charset="UTF-8">
    <title>test</title>
</head>
<body>
    <form id="form" method="post">
        <div id="panel" class="mini-panel" title="查询条件" style="width: 60%;" showToolbar="true"
             iconCls="icon-search" showCollapseButton="true" showFooter="true" allowResize="true"
             collapseOnTitleClick="true" expanded="true">
            <table align="center">
                <tr>
                    <td class="form-lable">id</td>
                    <td>
                        <input id="id" name="id" class="mini-textbox" style="width: 120px;"/>
                    </td>
                    <td class="form-lable">用户名</td>
                    <td>
                        <input id="username" name="username" class="mini-textbox" style="width: 120px;"/>
                    </td>
                    <td class="form-lable">中文名</td>
                    <td>
                        <input id="chinesename" name="chinesename" class="mini-textbox" style="width: 120px;"/>
                    </td>

                    <td align="center" width=20%>
                        <a class="mini-button" onclick="queryClick()" iconCls="icon-find" width="77px">查询</a>
                        <a class="mini-button" onclick="resetClick()" iconCls="icon-clear" width="77px">重置</a>
                    </td>
                </tr>
            </table>
        </div>
    </form>
    <div style="width: 60%;">
        <div class="mini-toolbar" style="border-bottom: 0; padding: 0px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 100%;" align="right">
                        <a class="mini-button" iconCls="icon-add" onclick="addRow()" plain="true">添加</a>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div id="datagrid1" class="mini-datagrid" style="width:60%;height:450px;" allowCellEdit="true" allowCellSelect="true"
    url="http://localhost:8080/user/userList">
        <div property="columns">
            <div field="id" name="id" width="150" headerAlign="center" align="center" allowSort="true">用户名id
                <input property="editor" class="mini-textbox" style="width:100%;"/></div>
            <div field="username" name="username" width="150" headerAlign="center" align="center" allowSort="true">用户名
                <input property="editor" class="mini-textbox" style="width:100%;"/></div>
            <div field="chinesename" name="chinesename" width="150" headerAlign="center" align="center" allowSort="true">中文名
                <input property="editor" class="mini-textbox" style="width:100%;"/></div>
            <div field="path" name="path" width="150" headerAlign="center" align="center" allowSort="true">跳转路径
                <input property="editor" class="mini-textbox" style="width:100%;"/></div>
            <div field="level" name="level" width="100" headerAlign="center" align="center" allowSort="true" type="comboboxcolumn">等级
                <input property="editor" class="mini-combobox" textField="label" valueField="value" style="width:100%;" data="[{value:'1',label:'普通管理员'},{value:'2',label:'普通用户'}] "/></div>
            <div field="status" name="status" width="110" headerAlign="center" align="center" allowSort="true">状态
                <input property="editor" class="mini-textbox" style="width:100%;"/></div>
            <div field="creatdate" name="creatdate" width="150" headerAlign="center" align="center" allowSort="true" dateFormat="yyyy-MM-dd">创建时间
                <input property="editor" class="mini-datepicker" style="width:100%;"/></div>
            <div name="action" width="120" headerAlign="center" align="center" renderer="onActionRenderer" cellStyle="padding:0;">操作</div>
        </div>
    </div>


</body>
<script type="text/javascript">
    mini.parse();
    var grid = mini.get("datagrid1");
    grid.load();

    function addRow() {
        var row = {"state":"add"};
        grid.addRow(row, 0);

        grid.cancelEdit();
        grid.beginEditRow(row);
    }

    function delRow(row_uid) {
        var row = grid.getRowByUID(row_uid);
        if (row.id) {
            if (mini.confirm("确定删除此记录？")) {
                grid.loading("删除中，请稍后......");
                $.ajax({
                    url: "http://localhost:8080/user/deleteById/" + row.id,
                    success: function (text) {
                        grid.reload();
                    },
                    error: function () {
                    }
                });
            }
        }else{
            grid.reload();
        }
    }

    function updateRow(row_uid) {
        debugger;
        var row = grid.getRowByUID(row_uid);

        grid.commitEdit();

        grid.loading("保存中，请稍后......");
        var json = mini.encode(row);

        $.ajax({
            url: "http://localhost:8080/user/save",
            type: "POST",
            contentType : 'application/json;charset=utf-8',
            dataType:"json",
            data: json ,
            success: function (text) {
                mini.alert(text.message);
                grid.reload();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
            }
        });

    }
    function onActionRenderer(e) {
        var record = e.record;
        var uid = record._uid;
        var row = e.row;
        if(row.state == "add"){
            s = ' <a class="Update_Button" href="javascript:updateRow(\'' + uid + '\')"> 保存</a>'
                + ' <a class="Cancel_Button" href="javascript:delRow(\'' + uid + '\')"> 删除</a>'
        }else{
            s = ' <a class="Update_Button" href="javascript:updateRow(\'' + uid + '\')"> 修改</a>'
                + ' <a class="Cancel_Button" href="javascript:delRow(\'' + uid + '\')"> 删除</a>'
        }
        return s;
    }
    function queryClick() {
        debugger;
        var form = new mini.Form("#form");
        var data = form.getData();
        grid.load(data);
    }

    function resetClick() {
        var form = new mini.Form("#form");
        form.clear();
    }

</script>
</html>

源代码地址请点击这里：https://github.com/xyc452774979/newlisttest-xinyuchao
