package com.smhrd.model;

public class MyUser {
   
   private String id;
   private String pw;
   
   
   
   @Override
   public String toString() {
      return "MyUser [id=" + id + ", pw=" + pw + ", getId()=" + getId() + ", getPw()=" + getPw() + ", getClass()="
            + getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
   }
   public MyUser() {
      
   }
   public MyUser(String id, String pw) {
      super();
      this.id = id;
      this.pw = pw;
   }
   public String getId() {
      return id;
   }
   public void setId(String id) {
      this.id = id;
   }
   public String getPw() {
      return pw;
   }
   public void setPw(String pw) {
      this.pw = pw;
   }
   
   

}
