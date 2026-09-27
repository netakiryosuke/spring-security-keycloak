package com.netakiryosuke.spring_security_keycloak.infrastructure;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.netakiryosuke.spring_security_keycloak.domain.User;
import com.netakiryosuke.spring_security_keycloak.domain.UserRepository;

@Repository
public class DummyUserRepository implements UserRepository {

    private static final String TARGET_USER_ID = "e84b9cd1-2c6f-42f8-8b19-da5d978711c9";

    private static final List<User> STORE = List.of(
        new User("83371f03-6922-449f-9d58-dd5013089f8d", "testuser", "user@example.com",
                LocalDate.parse("1998-03-12"), "東京都", "エンジニア", "休日はカフェ巡りをしています。", "好きな人への返信は毎回AIに添削してもらっている。自然体だねと言われて少しつらい。"),
        new User("cbce3bf2-eedd-4205-8f94-f5a2d34a1889", "adminuser", "admin@example.com",
                LocalDate.parse("1990-11-20"), "神奈川県", "運営スタッフ", "安心して交流できる場所を目指しています。", "恋愛相談には偉そうに答えるけれど、自分の告白は鏡の前で練習しても声が裏返る。"),
        new User(TARGET_USER_ID, "osawa", "osawa@example.com",
                LocalDate.parse("2003-03-28"), "神奈川県", "エンジニア", "お酒が好きです。", "付き合う前の花火デートで、彼女に合わせて前日に慌てて買った浴衣を、たまたま家にあったと嘘をついた。"),
        new User("a5b5febd-bdc0-4ea3-a1f7-0f8ee6271bcc", "sora", "sora@example.com",
                LocalDate.parse("1997-02-18"), "大阪府", "デザイナー", "美術館を一緒に巡りたいです。", "まだ付き合ってもいない相手との結婚式の招待状をデザインして、うっかり印刷までした。"),
        new User("eb36c9ab-5f69-4f9c-8eed-bfe53c16353c", "aoi", "aoi@example.com",
                LocalDate.parse("1996-09-03"), "京都府", "司書", "おすすめの本を教えてください。", "好きな人を主人公にした恋愛小説を書いている。自分が告白される場面だけで三章ある。"),
        new User("c61a465e-b754-4f18-b008-e881594ac49a", "ren", "ren@example.com",
                LocalDate.parse("1993-12-15"), "福岡県", "料理人", "新しいレシピを試すのが楽しみです。", "手作りと言って渡したお菓子は買ってきたもの。褒められて、次は何を作ろうかと答えてしまった。"),
        new User("31bb0882-87e5-4b56-9fcb-be5d189f5ce1", "yui", "yui@example.com",
                LocalDate.parse("1999-04-08"), "北海道", "看護師", "旅行先で写真を撮っています。", "デートの前日は、ぬいぐるみを相手に会話を練習している。褒められたときの照れ方まで決めてある。"),
        new User("d8e00b9a-3631-413e-91af-182947239425", "kaito", "kaito@example.com",
                LocalDate.parse("1994-06-21"), "愛知県", "建築士", "街の建物を眺めるのが好きです。", "一度食事しただけの相手との新居を設計した。相手の部屋の採光まで真剣に考えてしまった。"),
        new User("a31f2f62-e1dd-491c-9b1d-bd2fdf52a9b1", "mio", "mio@example.com",
                LocalDate.parse("1998-10-10"), "兵庫県", "販売員", "休日はパン屋を探しています。", "偶然会ったふりをしたくて、好きな人が来る店でパンを買い続けている。冷凍庫がもう閉まらない。"),
        new User("8f3f53e5-769e-4e00-b1bf-df9132ef84c5", "itsuki", "itsuki@example.com",
                LocalDate.parse("1992-01-30"), "長野県", "農家", "季節の野菜を育てています。", "好きな人の名前を育てているトマトに付けて、毎朝おはようと話しかけている。家族には絶対に言えない。"),
        new User("af0d76c4-15cb-453a-a0b1-3ee1a0f67c85", "hina", "hina@example.com",
                LocalDate.parse("2000-08-16"), "宮城県", "編集者", "音楽と喫茶店が好きです。", "自分宛ての理想のラブレターを自分で書いて読み返している。毎回ちょっと感動してしまう。"),
        new User("ba729865-e7cc-4b33-a8fa-58fb5d4d5f29", "takumi", "takumi@example.com",
                LocalDate.parse("1991-05-27"), "広島県", "整備士", "週末はサイクリングをしています。", "デートで道に迷わないよう三回下見したのに、当日は初めて来たと言い張った。店員には常連扱いされた。"),
        new User("951d6e4a-5937-4ca1-8c78-9fc9136d81bb", "saki", "saki@example.com",
                LocalDate.parse("1997-11-06"), "静岡県", "保育士", "海辺を歩くのが好きです。", "好きな人から届いた了解の二文字をスクリーンショットにして保存している。フォルダ名は大切な思い出。"),
        new User("0c405565-bcdd-4c27-9e83-76a56ffecfe1", "nao", "nao@example.com",
                LocalDate.parse("1995-03-25"), "埼玉県", "研究員", "ボードゲーム仲間を探しています。", "返信を待つ間、通知が来ていないか何度も自分のスマホに別の端末からメッセージを送って動作確認している。"),
        new User("bfb9e53d-bb5d-4c0b-801f-378c1cbdd211", "koharu", "koharu@example.com",
                LocalDate.parse("1996-12-02"), "沖縄県", "ガイド", "地元の景色を紹介したいです。", "告白の言葉を録音して聞き直している。最新版のファイル名は告白_最終_本当の最終_7。")
    );

    @Override
    public Optional<User> findById(String id) {
        return STORE.stream()
                .filter(user -> user.id().equals(id))
                .findFirst();
    }

    @Override
    public List<User> findAll() {
        return STORE;
    }
}
