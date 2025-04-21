
CREATE TABLE TB_CART (
    C_IDX INT AUTO_INCREMENT PRIMARY KEY,
    U_ID VARCHAR(50),
    P_IDX INT,
    CONSTRAINT FK_CART_USER FOREIGN KEY (U_ID) REFERENCES TB_USER(U_ID),
    CONSTRAINT FK_CART_PRODUCT FOREIGN KEY (P_IDX) REFERENCES TB_PRODUCT(P_IDX)
);

CREATE TABLE test (
  p_idx INT AUTO_INCREMENT PRIMARY KEY,
  p_name VARCHAR(100),
  price INT,
  p_status TEXT,
  p_ownership INT,
  p_img1 VARCHAR(255),
  p_img2 VARCHAR(255),
  p_img3 VARCHAR(255)
);


ALTER TABLE TB_REVIEW
MODIFY COLUMN REVIEW_IMG TEXT;

INSERT INTO test (p_name, price, p_status, p_ownership, p_img1, p_img2, p_img3)
VALUES ('테스트폰', 100000, '상태 좋음', 1, 'url1', 'url2', 'url3');

ALTER TABLE TB_PRODUCT
MODIFY COLUMN P_STATUS VARCHAR(500) NOT NULL;

select * from test; 

drop table test;

delete from TB_CART;

DELETE FROM TB_USER;

ALTER TABLE TB_USER
ADD COLUMN EMAIL VARCHAR(100) AFTER PHONE;

ALTER TABLE TB_PRODUCT
ADD COLUMN COLOR VARCHAR(50) COMMENT '제품 색상';


select * from TB_USER; 				/*회원정보*/
select * from TB_PRODUCT;			/*보유제품*/
select * from TB_ORDER;				/*주문정보*/
select * from TB_ORDER_DETAILS;		/*주문상세*/
select * from TB_REVIEW;			/* 리뷰 */
select * from TB_REQUEST;			/* 요청 */
select * from TB_CART;				/*장바구니*/

select * from TB_PRODUCT;

select * from TB_CART where U_ID = "test";

ALTER TABLE TB_REVIEW MODIFY COLUMN REVIEW_IMG TEXT;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE TB_REVIEW;
SET FOREIGN_KEY_CHECKS = 1;

UPDATE TB_PRODUCT
SET P_STATUS = "0"
WHERE P_STATUS = "판매완료";

DESC TB_PRODUCT;
DESC TB_REVIEW;
ALTER TABLE TB_ORDER
ADD COLUMN P_IDX INT,
ADD CONSTRAINT FK_ORDER_P_IDX
FOREIGN KEY (P_IDX) REFERENCES TB_PRODUCT(P_IDX);


ALTER TABLE TB_PRODUCT DROP COLUMN P_IMG3;

ALTER TABLE TB_PRODUCT ADD COLUMN P_IMG3 VARCHAR(1000) COMMENT '사진3';

INSERT INTO TB_REVIEW (
    P_IDX, 
    REVIEW_CONTENT, 
    REVIEW_RATINGS, 
    REVIEW_IMG, 
    U_ID
) VALUES (
    2, 
    '살까 고민했던 핸드폰이였는데 가격이 합리적이여서 구매했어요', 
    5, 
    'https://i.ibb.co/XxcBL6gr/Kakao-Talk-20250417-190306738.png', 
    '채수민'
);

INSERT INTO TB_PRODUCT (
    P_NAME,
    PRICE,
    P_STATUS,
    P_OWNERSHIP,
    P_IMG1,
    CREATED_AT,
    COLOR
) VALUES (
    '삼성전자 갤럭시 폴드3 256G',
    400000,
    '판매중',
    1,
    'https://i.ibb.co/q3kF9vGs/image.png',
    NOW(),
    '블랙'
);

