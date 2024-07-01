# skip-go

## Project Structure

```sh
├── examples
│   └── nextjs
├── packages
│   ├── core
│   └── widget
```

- `core` (@skip-go/core): The core package of the project. Contains the core logic, api fetch and types, helper functions, signing, etc.
- `widget` (@skip-go/widget): React library that contains the swap widget components.
- `examples`: The example app of the project

## Dev Setup

Install dependencies:

```bash
yarn
```

Update submodule:

```bash
yarn run submodule
```

Generate codegen files:

```bash
yarn run codegen
```

Start the development server:

it will run watch the core and widget packages,it will run the example app on `http://localhost:3000`

```bash
yarn dev
```

Build the packages:

```bash
yarn build
```
