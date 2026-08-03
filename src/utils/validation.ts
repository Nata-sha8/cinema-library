const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
};

export type ValidationField = "email" | "password" | "name" | "surname" | "confirmPassword";
export const validateField = (field: ValidationField, value: string, password?: string): string | null => {
  if (!value.trim()) {
    return "Это поле обязательно";
  }

  switch (field) {
    case "email":
      if (!isValidEmail(value)) {
        return "Введите корректный email";
      }
      break;

    case "name":
    case "surname":
      if (value.length < 2) {
        return field === "name"
          ? "Имя должно содержать минимум 2 символа"
          : "Фамилия должна содержать минимум 2 символа";
      }
      break;

    case "password":
      if (value.length < 6) {
        return "Пароль должен содержать минимум 6 символов";
      }
      break;

    case "confirmPassword":
      if (value !== password) {
        return "Пароли не совпадают";
      }
      break;
  }

  return null;
};
