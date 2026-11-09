# KREOMORA — contact drafts

Helpers and all templates: `lib/contact.ts`. Official recipients: `data/contact.ts`.

Contexts: general, studio, multstory, studioProject, multstoryProject. Telegram project messages use the current localized title. Project email keeps the supplied STUDIO/MULTSTORY subject and body. Shared footer and mobile menu intentionally use the general context.

Telegram uses the [official public username draft format](https://core.telegram.org/api/links#public-username-links), not sharing links. Values are encoded with encodeURIComponent. Email uses encoded subject and body with paragraph breaks. No automatic sending, confirmation modal or tracking.

## RU templates

### general

Telegram:

Добрый день! Хотим заказать проект у KREOMORA. Подскажите, пожалуйста, как можем обсудить детали?

Email subject: KREOMORA — Новый проект

Email body:

```text
Добрый день!

Хотим заказать проект у KREOMORA.

Подскажите, пожалуйста, как можем обсудить детали?

Спасибо!
```

### studio

Telegram:

Добрый день! Хотим заказать коммерческий проект у KREOMORA STUDIO. Подскажите, пожалуйста, как можем обсудить идею, формат и стоимость?

Email subject: KREOMORA STUDIO — Коммерческий проект

Email body:

```text
Добрый день!

Хотим заказать коммерческий проект у KREOMORA STUDIO.

Хотели бы обсудить идею, формат, сроки и стоимость.

Подскажите, пожалуйста, с чего лучше начать?
```

### multstory

Telegram:

Добрый день! Хотим заказать персональную историю у KREOMORA MULTSTORY. Подскажите, пожалуйста, как можем обсудить идею и детали?

Email subject: KREOMORA MULTSTORY — Персональная история

Email body:

```text
Добрый день!

Хотим заказать персональную историю у KREOMORA MULTSTORY.

Хотели бы обсудить идею и детали проекта.

Подскажите, пожалуйста, с чего лучше начать?
```

### studioProject — Telegram

Добрый день! Посмотрели проект «{PROJECT_TITLE}» на сайте KREOMORA. Хотим обсудить похожий коммерческий проект. Подскажите, пожалуйста, как можем начать?

### multstoryProject — Telegram

Добрый день! Посмотрели историю «{PROJECT_TITLE}» на сайте KREOMORA. Хотим создать свою персональную историю. Подскажите, пожалуйста, как можем начать?

## EN templates

### general

Telegram:

Hello! We’d like to order a project from KREOMORA. Could we discuss the details?

Email subject: KREOMORA — New Project

Email body:

```text
Hello!

We’d like to order a project from KREOMORA.

Could we discuss the details?

Thank you!
```

### studio

Telegram:

Hello! We’d like to order a commercial project from KREOMORA STUDIO. Could we discuss the idea, format and pricing?

Email subject: KREOMORA STUDIO — Project Inquiry

Email body:

```text
Hello!

We’d like to order a commercial project from KREOMORA STUDIO.

We’d like to discuss the concept, format, timeline and pricing.

How can we get started?
```

### multstory

Telegram:

Hello! We’d like to order a personal story from KREOMORA MULTSTORY. Could we discuss the idea and details?

Email subject: KREOMORA MULTSTORY — Personal Story

Email body:

```text
Hello!

We’d like to order a personal story from KREOMORA MULTSTORY.

We’d like to discuss the idea and project details.

How can we get started?
```

### studioProject — Telegram

Hello! We saw the “{PROJECT_TITLE}” project on the KREOMORA website and would like to discuss something similar. How can we get started?

### multstoryProject — Telegram

Hello! We saw the “{PROJECT_TITLE}” story on the KREOMORA website and would like to create our own personal film. How can we get started?

## Verification

- TypeScript, lint, production build: passed.
- All five contexts round-trip Unicode, special title characters and paragraph breaks correctly.
- 46 rendered contact-bearing pages including all 36 localized cases have the expected Telegram draft and email subject/body. The broader 50-page localization suite also passes.
- Browser click opened the official @KreomoraX landing page. Telegram carried the exact Russian draft into its tg://resolve link. No message was sent.
- Full Telegram composer verification: not completed; the app did not open in the available environment.
- Email CTA clicked; correct recipient, subject and body verified in generated links. A mail composer did not open; Gmail/Apple Mail/Outlook composer compatibility was not directly tested.
- Final device check: open a CTA in your installed Telegram and mail client, confirm the prefilled text, and close without sending.
