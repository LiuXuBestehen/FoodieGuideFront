// 验证规则
const validation = {
    username: {
        minLength: 4,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        sensitiveWords: ['admin', 'root', 'test', 'user', 'guest', 'null', 'undefined']
    },
    email: {
        maxLength: 254,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        minLength: 8,
        maxLength: 128,
        pattern: {
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            number: /[0-9]/,
            special: /[!@#$%^&*(),.?":{}|<>]/
        },
        weakPasswords: [
            'password', '12345678', 'qwerty123', 'abc123456',
            'password123', '123456789', 'qwertyuiop', 'admin123'
        ]
    }
};

// 验证函数
export const validateUsername = (username) => {
    const errors = [];

    if (!username.trim()) {
        errors.push('用户名不能为空');
        return errors;
    }

    const trimmed = username.trim();

    if (trimmed !== username) {
        errors.push('用户名首尾不能包含空格');
    }

    if (trimmed.length < validation.username.minLength) {
        errors.push(`用户名至少需要${validation.username.minLength}个字符`);
    }

    if (trimmed.length > validation.username.maxLength) {
        errors.push(`用户名不能超过${validation.username.maxLength}个字符`);
    }

    if (!validation.username.pattern.test(trimmed)) {
        errors.push('用户名只能包含字母、数字和下划线');
    }

    if (validation.username.sensitiveWords.some(word =>
        trimmed.toLowerCase().includes(word.toLowerCase()))) {
        errors.push('用户名包含敏感词汇，请重新输入');
    }

    return errors;
};

export const validateEmail = (email) => {
    const errors = [];

    if (!email.trim()) {
        errors.push('邮箱不能为空');
        return errors;
    }

    if (email.includes(' ')) {
        errors.push('邮箱不能包含空格');
    }

    if (email.length > validation.email.maxLength) {
        errors.push(`邮箱长度不能超过${validation.email.maxLength}个字符`);
    }

    if (!validation.email.pattern.test(email)) {
        errors.push('请输入有效的邮箱格式');
    }

    return errors;
};

export const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        errors.push('密码不能为空');
        return errors;
    }

    if (password.length < validation.password.minLength) {
        errors.push(`密码至少需要${validation.password.minLength}个字符`);
    }

    if (password.length > validation.password.maxLength) {
        errors.push(`密码不能超过${validation.password.maxLength}个字符`);
    }

    if (!validation.password.pattern.uppercase.test(password)) {
        errors.push('密码必须包含至少一个大写字母');
    }

    if (!validation.password.pattern.lowercase.test(password)) {
        errors.push('密码必须包含至少一个小写字母');
    }

    if (!validation.password.pattern.number.test(password)) {
        errors.push('密码必须包含至少一个数字');
    }

    if (!validation.password.pattern.special.test(password)) {
        errors.push('密码必须包含至少一个特殊字符');
    }

    if (validation.password.weakPasswords.some(weak =>
        password.toLowerCase().includes(weak.toLowerCase()))) {
        errors.push('密码过于简单，请使用更复杂的密码');
    }

    return errors;
};