package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.supplier.Supplier;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class SupplierMapperTest {

    @Autowired
    private SupplierMapper supplierMapper;

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 仕入先が登録されている
        Supplier supplier = createSupplier("花卸問屋A", "03-1111-2222", "supplier-a@example.com", "東京都中央区1-1-1");
        supplierMapper.insert(supplier);

        // When: 全件取得する
        List<Supplier> suppliers = supplierMapper.findAll();

        // Then: 登録した仕入先が含まれる
        assertThat(suppliers).isNotEmpty();
        assertThat(suppliers).anyMatch(s -> "花卸問屋A".equals(s.getSupplierName()));
    }

    @Test
    void findById_存在するIDの場合_仕入先が取得できる() {
        // Given: 仕入先が登録されている
        Supplier supplier = createSupplier("花卸問屋B", "03-3333-4444", "supplier-b@example.com", "東京都港区2-2-2");
        supplierMapper.insert(supplier);
        Long supplierId = supplier.getSupplierId();

        // When: IDで検索する
        Supplier found = supplierMapper.findById(supplierId);

        // Then: 一致する仕入先が返る
        assertThat(found).isNotNull();
        assertThat(found.getSupplierName()).isEqualTo("花卸問屋B");
        assertThat(found.getPhone()).isEqualTo("03-3333-4444");
        assertThat(found.getEmail()).isEqualTo("supplier-b@example.com");
        assertThat(found.getAddress()).isEqualTo("東京都港区2-2-2");
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Supplier found = supplierMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規仕入先データ
        Supplier supplier = createSupplier("花卸問屋C", "06-5555-6666", "supplier-c@example.com", "大阪府大阪市北区3-3-3");

        // When: 登録する
        supplierMapper.insert(supplier);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(supplier.getSupplierId()).isNotNull();
        Supplier found = supplierMapper.findById(supplier.getSupplierId());
        assertThat(found.getSupplierName()).isEqualTo("花卸問屋C");
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 仕入先が登録されている
        Supplier supplier = createSupplier("花卸問屋D", "092-7777-8888", "supplier-d@example.com", "福岡県福岡市中央区4-4-4");
        supplierMapper.insert(supplier);

        // When: 名前を更新する
        supplier.setSupplierName("花卸問屋D改");
        supplier.setPhone("092-9999-0000");
        supplierMapper.update(supplier);

        // Then: 更新が反映される
        Supplier found = supplierMapper.findById(supplier.getSupplierId());
        assertThat(found.getSupplierName()).isEqualTo("花卸問屋D改");
        assertThat(found.getPhone()).isEqualTo("092-9999-0000");
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 仕入先が登録されている
        Supplier supplier = createSupplier("花卸問屋E", "052-1111-2222", "supplier-e@example.com", "名古屋市中区5-5-5");
        supplierMapper.insert(supplier);
        Long supplierId = supplier.getSupplierId();

        // When: 削除する
        supplierMapper.deleteById(supplierId);

        // Then: 取得できなくなる
        Supplier found = supplierMapper.findById(supplierId);
        assertThat(found).isNull();
    }

    private Supplier createSupplier(String supplierName, String phone, String email, String address) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(supplierName);
        supplier.setPhone(phone);
        supplier.setEmail(email);
        supplier.setAddress(address);
        return supplier;
    }
}
