using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.IO;

public partial class demo_fileUpload_fileUpload : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) 
    {

        // 获得程序路径
        string tempFile = Request.PhysicalApplicationPath;

        HttpFileCollection collection = System.Web.HttpContext.Current.Request.Files;
        for (int i = 0; i < collection.Count; i++)
        {
            HttpPostedFile post = collection[i];
            if (post.ContentLength > 0)
            {
                string s = post.FileName;
                char[] separator = { '\\' };
                string[] sArr = s.Split(separator);
                string fileName = sArr[sArr.Length - 1];

                post.SaveAs(string.Format("{0}{1}{2}", tempFile, "demo\\multiupload\\upload\\", fileName));
            }
        }

        Response.Write("(" + DateTime.Now + ")");   




        // 获得程序路径
        //string tempFile = Request.PhysicalApplicationPath;
        //HttpRequest request = System.Web.HttpContext.Current.Request;
        //HttpFileCollection FileCollect = request.Files;

        //if (FileCollect.Count > 0)          //如果集合的数量大于0
        //{
        //    foreach (string str in FileCollect)
        //    {
        //        HttpPostedFile FileSave = FileCollect[str];  //用key获取单个文件对象HttpPostedFile

        //        FileSave.SaveAs(string.Format("{0}{1}{2}", tempFile, "demo\\multiupload\\upload\\", FileSave.FileName));
              
        //    }
        //}

        //找到目标文件对象
        //c = Request.Files["Fdata"];

        //// 如果有文件, 则保存到一个地址
        //if (uploadFile.ContentLength > 0)
        //{
        //    uploadFile.SaveAs(string.Format("{0}{1}{2}", tempFile, "demo\\multiupload\\upload\\", uploadFile.FileName));
        //}

        //Response.Write(uploadFile.FileName +"("+DateTime.Now+")");    //可以返回一个JSON字符串, 在客户端做更多处理
    }
}