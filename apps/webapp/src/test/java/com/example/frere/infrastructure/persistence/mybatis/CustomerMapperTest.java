package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.customer.Customer;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
class CustomerMapperTest {

    @Autowired
    private CustomerMapper customerMapper;

    @Test
    void findAll_データが存在する場合_全件取得できる() {
        // Given: 得意先が登録されている
        Customer customer = createCustomer("田中太郎", "tanaka@example.com", "hashed_password_1", "090-1234-5678", "東京都千代田区1-1-1");
        customerMapper.insert(customer);

        // When: 全件取得する
        List<Customer> customers = customerMapper.findAll();

        // Then: 登録した得意先が含まれる
        assertThat(customers).isNotEmpty();
        assertThat(customers).anyMatch(c -> "tanaka@example.com".equals(c.getEmail()));
    }

    @Test
    void findById_存在するIDの場合_得意先が取得できる() {
        // Given: 得意先が登録されている
        Customer customer = createCustomer("田中太郎", "tanaka-find@example.com", "hashed_password_1", "090-1234-5678", "東京都千代田区1-1-1");
        customerMapper.insert(customer);
        Long customerId = customer.getCustomerId();

        // When: IDで検索する
        Customer found = customerMapper.findById(customerId);

        // Then: 一致する得意先が返る
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("田中太郎");
        assertThat(found.getEmail()).isEqualTo("tanaka-find@example.com");
        assertThat(found.getPasswordHash()).isEqualTo("hashed_password_1");
        assertThat(found.getPhone()).isEqualTo("090-1234-5678");
        assertThat(found.getAddress()).isEqualTo("東京都千代田区1-1-1");
    }

    @Test
    void findById_存在しないIDの場合_nullが返る() {
        // Given: 存在しないID
        Long nonExistentId = 99999L;

        // When: IDで検索する
        Customer found = customerMapper.findById(nonExistentId);

        // Then: nullが返る
        assertThat(found).isNull();
    }

    @Test
    void insert_正常なデータの場合_登録できる() {
        // Given: 新規得意先データ
        Customer customer = createCustomer("佐藤花子", "sato@example.com", "hashed_password_2", "080-9876-5432", "大阪府大阪市北区2-2-2");

        // When: 登録する
        customerMapper.insert(customer);

        // Then: IDが自動採番され、findByIdで取得できる
        assertThat(customer.getCustomerId()).isNotNull();
        Customer found = customerMapper.findById(customer.getCustomerId());
        assertThat(found.getName()).isEqualTo("佐藤花子");
        assertThat(found.getEmail()).isEqualTo("sato@example.com");
    }

    @Test
    void update_既存データの場合_更新できる() {
        // Given: 得意先が登録されている
        Customer customer = createCustomer("鈴木一郎", "suzuki@example.com", "hashed_password_3", "070-1111-2222", "福岡県福岡市中央区3-3-3");
        customerMapper.insert(customer);

        // When: 名前と住所を更新する
        customer.setName("鈴木次郎");
        customer.setAddress("福岡県福岡市博多区4-4-4");
        customerMapper.update(customer);

        // Then: 更新が反映される
        Customer found = customerMapper.findById(customer.getCustomerId());
        assertThat(found.getName()).isEqualTo("鈴木次郎");
        assertThat(found.getAddress()).isEqualTo("福岡県福岡市博多区4-4-4");
        assertThat(found.getEmail()).isEqualTo("suzuki@example.com");
    }

    @Test
    void deleteById_既存データの場合_削除できる() {
        // Given: 得意先が登録されている
        Customer customer = createCustomer("山田太郎", "yamada@example.com", "hashed_password_4", "060-3333-4444", "名古屋市中区5-5-5");
        customerMapper.insert(customer);
        Long customerId = customer.getCustomerId();

        // When: 削除する
        customerMapper.deleteById(customerId);

        // Then: 取得できなくなる
        Customer found = customerMapper.findById(customerId);
        assertThat(found).isNull();
    }

    private Customer createCustomer(String name, String email, String passwordHash, String phone, String address) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setEmail(email);
        customer.setPasswordHash(passwordHash);
        customer.setPhone(phone);
        customer.setAddress(address);
        return customer;
    }
}
