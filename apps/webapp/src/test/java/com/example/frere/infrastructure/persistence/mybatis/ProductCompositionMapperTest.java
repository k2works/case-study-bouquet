package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.item.Item;
import com.example.frere.domain.model.product.Product;
import com.example.frere.domain.model.product.ProductComposition;
import com.example.frere.domain.model.supplier.Supplier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class ProductCompositionMapperTest {

    @Autowired
    private ProductCompositionMapper productCompositionMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    private Long productId;
    private Long itemId;

    @BeforeEach
    void setUp() {
        // FK 親テーブル: 仕入先 → 単品、商品を先に登録
        Supplier supplier = new Supplier();
        supplier.setSupplierName("構成テスト仕入先");
        supplier.setPhone("03-0000-0000");
        supplier.setEmail("comp-test@example.com");
        supplier.setAddress("東京都テスト区");
        supplierMapper.insert(supplier);

        Item item = new Item();
        item.setItemName("テスト赤バラ");
        item.setSupplierId(supplier.getSupplierId());
        item.setQualityRetentionDays(7);
        item.setUnitPrice(new BigDecimal("300"));
        itemMapper.insert(item);
        itemId = item.getItemId();

        Product product = new Product();
        product.setProductName("テスト花束");
        product.setDescription("構成テスト用花束");
        product.setPrice(new BigDecimal("5000"));
        product.setIsActive(true);
        productMapper.insert(product);
        productId = product.getProductId();
    }

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 商品構成が登録されている
        ProductComposition composition = createComposition(3);
        productCompositionMapper.insert(composition);

        // When: 全件取得する
        List<ProductComposition> compositions = productCompositionMapper.findAll();

        // Then: 登録した商品構成が含まれる
        assertThat(compositions).isNotEmpty();
    }

    @Test
    void findById_存在するIDの場合_商品構成が取得できる() {
        // Given: 商品構成が登録されている
        ProductComposition composition = createComposition(5);
        productCompositionMapper.insert(composition);
        Long compositionId = composition.getCompositionId();

        // When: IDで検索する
        ProductComposition found = productCompositionMapper.findById(compositionId);

        // Then: 一致する商品構成が返る
        assertThat(found).isNotNull();
        assertThat(found.getProductId()).isEqualTo(productId);
        assertThat(found.getItemId()).isEqualTo(itemId);
        assertThat(found.getQuantity()).isEqualTo(5);
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        ProductComposition found = productCompositionMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規商品構成データ
        ProductComposition composition = createComposition(10);

        // When: 登録する
        productCompositionMapper.insert(composition);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(composition.getCompositionId()).isNotNull();
        ProductComposition found = productCompositionMapper.findById(composition.getCompositionId());
        assertThat(found.getQuantity()).isEqualTo(10);
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 商品構成が登録されている
        ProductComposition composition = createComposition(3);
        productCompositionMapper.insert(composition);

        // When: 数量を更新する
        composition.setQuantity(7);
        productCompositionMapper.update(composition);

        // Then: 更新が反映される
        ProductComposition found = productCompositionMapper.findById(composition.getCompositionId());
        assertThat(found.getQuantity()).isEqualTo(7);
        assertThat(found.getProductId()).isEqualTo(productId);
        assertThat(found.getItemId()).isEqualTo(itemId);
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 商品構成が登録されている
        ProductComposition composition = createComposition(2);
        productCompositionMapper.insert(composition);
        Long compositionId = composition.getCompositionId();

        // When: 削除する
        productCompositionMapper.deleteById(compositionId);

        // Then: 取得できなくなる
        ProductComposition found = productCompositionMapper.findById(compositionId);
        assertThat(found).isNull();
    }

    private ProductComposition createComposition(int quantity) {
        ProductComposition composition = new ProductComposition();
        composition.setProductId(productId);
        composition.setItemId(itemId);
        composition.setQuantity(quantity);
        return composition;
    }
}
