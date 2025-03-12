export default {
    title: 'Register',
    account: 'Set up user account',
    'no-account': 'No account?',
    'has-account': 'Already have an account?',
    placeholder: {
        username: 'Username',
        email: 'Email address'
    },
    email: {
        text: 'Email address',
        invalid: 'Please enter a valid email address'
    },
    format: 'Allowed: letters + numbers, 4-16 characters, must start with a letter',
    tips: {
        special: '<span class="red">[Important Notice]</span> Username cannot be modified once set',
        structure:
            '- Contains <span class="theme">letters</span>, <span class="theme">numbers</span> or <span class="theme">underscores</span>',
        start: '- Must <span class="theme">start with a letter</span> (e.g. makeit)',
        length: '- Length: <span class="theme">4-16 characters</span>'
    },
    login: 'Login now',
    validate: 'Verify now',
    socialite: 'Quick login methods',
    unknown: 'Unknown error',
    verify: 'Click to verify CAPTCHA',
    success: 'Registration successful',
    emailExpired: '30 minutes',
    successText:
        'Activation link sent to <a href="mailto:{email}">{email}</a> (valid for {expired}). Check spam/ad folders if not received.'
}
