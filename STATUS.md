## Updated: 06/17/19

# 🎉 Compatibility Status

|             webApp                              | widget | method  | inputElement              | type | knownIssues  |
|-------------------------------------------------|:------:|:-------:|:-------------------------:|:----:|:------------:| 
| <b>slack</b>                                    |        |         |                           |      | [![slack]](https://slack.com)             |
| [slack.com](https://slack.com)                  | custom | cloning | Main                      | DIV  |              |
| [slack.com](https://slack.com)                  | custom | cloning | Thread - Main             | DIV  |              |
| [slack.com](https://slack.com)                  | custom | cloning | Thread - Sidebar          | DIV  |              |
| [slack.com](https://slack.com)                  | custom | cloning | Reply                     | DIV  |              |
| <b>twitter</b>                                  |        |         |                           |      | [![twitter]](https://twitter.com)             |
| [twitter.com](https://twitter.com)              | custom | cloning | Feed - Tweet (compose) + Add | DIV  |              |
| [twitter.com](https://twitter.com)              | custom | cloning | Feed - Tweet (feed) + Add | DIV  |              |
| [twitter.com](https://twitter.com)              | custom | cloning | Feed - Reply (feed)       | DIV  |              |
| [twitter.com](https://twitter.com)              | custom | cloning | Feed - Retweet (feed)     | DIV  |              |
| [twitter.com](https://twitter.com)              | custom | cloning | Feed - Direct message     | DIV  |              |
| <b>telegram</b>                                 |        |         |                           |      |[![telegram]](https://web.telegram.org)|
| [web.telegram.org](https://web.telegram.org)    | custom | cloning | Send Message              | DIV  |              |
| <b>instagram</b>                                |        |         |                           |      |              |
| [instagram.com](https://instagram.com)          | custom | cloning | Feed - Add Comment        | TXTAA | focus ghosting required, improve widget placing |
| [instagram.com](https://instagram.com)          | custom | cloning | Post - Add Comment        | TXTAA | focus ghosting required,improve widget placing |
| <b>facebook</b>                                 |        |         |                           |     |              |
| [facebook.com](https://facebook.com)                         | custom | cloning | Feed - Create Post        | DIV | unknown script prevents backspace after replacing (removing keyDown eventListener), still posts the original text (set text in originaTextElement by simulate typing?)               |
| <b>messenger</b>                                |        |         |                           |     |              |
| [messenger.com](https://messenger.com)          | custom | cloning | Send Message              | DIV | unknown script prevents backspace after replacing (removing keyDown eventListener), still posts the original text (set text in originaTextElement by simulate typing?)               |
| <b>whatsapp</b>                                |        |         |                           |     |              |
| [web.whatsapp.com](https://web.whatsapp.com)    | custom | cloning | Send Message              | DIV | unknown script prevents backspace after replacing (removing keyDown eventListener), still posts the original text (set text in originaTextElement by simulate typing?)               |

[slack]: https://img.shields.io/badge/slack.com-supported-green.svg

[twitter]: https://img.shields.io/badge/twitter.com-supported-green.svg

[telegram]: https://img.shields.io/badge/web.telegram.org-supported-green.svg



