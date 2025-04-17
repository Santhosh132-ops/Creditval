#include <string>
#include <ctime>
#include <emscripten/bind.h>

using namespace emscripten;

// === Luhn Algorithm ===
bool luhn_check(const std::string& number) {
    int sum = 0;
    bool alt = false;
    for (int i = number.size() - 1; i >= 0; --i) {
        int n = number[i] - '0';
        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alt = !alt;
    }
    return sum % 10 == 0;
}

// === Basic Card Type Detection ===
std::string detect_card_type(const std::string& number) {
    if (number.size() >= 13 && number[0] == '4') return "Visa";
    if (number.size() >= 16 && number[0] == '5' && number[1] >= '1' && number[1] <= '5') return "MasterCard";
    if (number.size() >= 15 && number[0] == '3' && (number[1] == '4' || number[1] == '7')) return "American Express";
    if (number.size() >= 16 && number.substr(0, 4) == "6011") return "Discover";
    return "Unknown";
}

// === Mask Card Number ===
std::string mask_card(const std::string& number) {
    if (number.length() < 4) return "Invalid";
    return "**** **** **** " + number.substr(number.size() - 4);
}

// === Get Current UTC Time ===
std::string get_utc_time() {
    std::time_t t = std::time(nullptr);
    char buf[100];
    std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S UTC", std::gmtime(&t));
    return std::string(buf);
}

// === Country Guess by BIN Prefix ===
std::string guess_country(const std::string& number) {
    if (number.rfind("4", 0) == 0) return "Likely USA (Visa)";
    if (number.rfind("5", 0) == 0) return "Likely International (MasterCard)";
    if (number.rfind("3", 0) == 0) return "Likely USA (Amex)";
    if (number.rfind("6", 0) == 0) return "Likely USA (Discover)";
    return "Unknown";
}

// === Exposed validation function ===
emscripten::val validate_card(const std::string& number) {
    emscripten::val result = emscripten::val::object();

    if (number.length() < 13 || number.length() > 19) {
        result.set("error", "Invalid card number length.");
        return result;
    }
    for (char c : number) {
        if (!isdigit(c)) {
            result.set("error", "Card number must be numeric.");
            return result;
        }
    }

    result.set("card_number", mask_card(number));
    result.set("valid", luhn_check(number));
    result.set("card_type", detect_card_type(number));
    result.set("region_hint", guess_country(number));
    result.set("validated_at", get_utc_time());

    return result;
}

// Bindings
EMSCRIPTEN_BINDINGS(card_module) {
    function("validate_card", &validate_card);
}
