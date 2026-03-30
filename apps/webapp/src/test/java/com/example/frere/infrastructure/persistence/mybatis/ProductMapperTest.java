package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.product.Product;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class ProductMapperTest {

    @Autowired
    private ProductMapper productMapper;

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 商品が登録されている
        Product product = createProduct("春の花束", "春をイメージした花束です", new BigDecimal("5000"), true);
        productMapper.insert(product);

        // When: 全件取得する
        List<Product> products = productMapper.findAll();

        // Then: 登録した商品が含まれる
        assertThat(products).isNotEmpty();
        assertThat(products).anyMatch(p -> "春の花束".equals(p.getProductName()));
    }

    @Test
    void findById_存在するIDの場合_商品が取得できる() {
        // Given: 商品が登録されている
        Product product = createProduct("夏の花束", "夏をイメージした花束です", new BigDecimal("6000"), true);
        productMapper.insert(product);
        Long productId = product.getProductId();

        // When: IDで検索する
        Product found = productMapper.findById(productId);

        // Then: 一致する商品が返る
        assertThat(found).isNotNull();
        assertThat(found.getProductName()).isEqualTo("夏の花束");
        assertThat(found.getDescription()).isEqualTo("夏をイメージした花束です");
        assertThat(found.getPrice()).isEqualByComparingTo(new BigDecimal("6000"));
        assertThat(found.getIsActive()).isTrue();
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Product found = productMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規商品データ
        Product product = createProduct("秋の花束", null, new BigDecimal("4500"), true);

        // When: 登録する
        productMapper.insert(product);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(product.getProductId()).isNotNull();
        Product found = productMapper.findById(product.getProductId());
        assertThat(found.getProductName()).isEqualTo("秋の花束");
        assertThat(found.getDescription()).isNull();
    }

    @Test
    void insert_説明がnullの場合_登録できる() {
        // Given: 説明がnullの商品データ（description はNULL許容）
        Product product = createProduct("冬の花束", null, new BigDecimal("7000"), true);

        // When: 登録する
        productMapper.insert(product);

        // Then: 登録が成功し、descriptionはnullのまま
        Product found = productMapper.findById(product.getProductId());
        assertThat(found).isNotNull();
        assertThat(found.getDescription()).isNull();
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 商品が登録されている
        Product product = createProduct("お祝い花束", "お祝い用の花束", new BigDecimal("8000"), true);
        productMapper.insert(product);

        // When: 価格と有効フラグを更新する
        product.setPrice(new BigDecimal("9000"));
        product.setIsActive(false);
        productMapper.update(product);

        // Then: 更新が反映される
        Product found = productMapper.findById(product.getProductId());
        assertThat(found.getPrice()).isEqualByComparingTo(new BigDecimal("9000"));
        assertThat(found.getIsActive()).isFalse();
        assertThat(found.getProductName()).isEqualTo("お祝い花束");
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 商品が登録されている
        Product product = createProduct("テスト花束", "削除テスト用", new BigDecimal("3000"), true);
        productMapper.insert(product);
        Long productId = product.getProductId();

        // When: 削除する
        productMapper.deleteById(productId);

        // Then: 取得できなくなる
        Product found = productMapper.findById(productId);
        assertThat(found).isNull();
    }

    private Product createProduct(String productName, String description, BigDecimal price, Boolean isActive) {
        Product product = new Product();
        product.setProductName(productName);
        product.setDescription(description);
        product.setPrice(price);
        product.setIsActive(isActive);
        return product;
    }
}
