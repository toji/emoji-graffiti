// Copyright (c) 2022 Brandon Jones
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/** WGSL Preprocessor v1.0.2 **/
const preprocessorSymbols = /#([^\s]*)(\s*)/gm

interface ConditionalBranch {
  expression: boolean,
  string: string,
};

class ConditionalState {
  elseIsValid = true;
  branches: ConditionalBranch[] = [];

  constructor(initialExpression: any) {
    this.pushBranch('if', initialExpression);
  }

  pushBranch(token: string, expression: any) {
    if (!this.elseIsValid) {
      throw new Error(`#${token} not preceeded by an #if or #elif`);
    }
    this.elseIsValid = (token === 'if' || token === 'elif');
    this.branches.push({
      expression: !!expression,
      string: ''
    });
  }

  appendStringToCurrentBranch(...strings: string[]) {
    for (const str of strings) {
      this.branches[this.branches.length-1].string += str;
    }
  }

  resolve() {
    for (const branch of this.branches) {
      if (branch.expression) {
        return branch.string;
      }
    }

    return '';
  }
}

// Template literal tag that handles simple preprocessor symbols for WGSL
// shaders. Supports #if/elif/else/endif statements.
export function wgsl(strings: TemplateStringsArray, ...values: any[]) {
  const stateStack = [];
  let state = new ConditionalState(true);
  state.elseIsValid = false;
  let depth = 1;

  const assertTemplateFollows = (match: RegExpExecArray, str: string) => {
    if (match.index + match[0].length != str.length) {
      throw new Error(`#${match[1]} must be immediately followed by a template expression (ie: \${value})`);
    }
  }

  for (let i = 0; i < strings.length; ++i) {
    const str = strings[i];
    const matchedSymbols = str.matchAll(preprocessorSymbols);

    let lastIndex = 0;
    let valueConsumed = false;

    for (const match of matchedSymbols) {
      state.appendStringToCurrentBranch(str.substring(lastIndex, match.index));

      switch (match[1]) {
        case 'if':
          assertTemplateFollows(match, str);

          valueConsumed = true;
          stateStack.push(state);
          state = new ConditionalState(values[i]);
          break;
        case 'elif':
          assertTemplateFollows(match, str);

          valueConsumed = true;
          state.pushBranch(match[1], values[i]);
          break;
        case 'else':
          state.pushBranch(match[1], true);
          state.appendStringToCurrentBranch(match[2]);
          break;
        case 'endif':
          if (!stateStack.length) {
            throw new Error(`#${match[1]} not preceeded by an #if`);
          }

          const result = state.resolve();

          state = stateStack.pop()!;
          state.appendStringToCurrentBranch(result, match[2]);
          break;
        default:
          // Unknown preprocessor symbol. Emit it back into the output string unchanged.
          state.appendStringToCurrentBranch(match[0]);
          break;
      }

      lastIndex = match.index + match[0].length;
    }

    // If the string didn't end on one of the preprocessor symbols append the rest of it here.
    if (lastIndex != str.length) {
      state.appendStringToCurrentBranch(str.substring(lastIndex, str.length));
    }

    // If the next value wasn't consumed by the preprocessor symbol, append it here.
    if (!valueConsumed && values.length > i) {
      state.appendStringToCurrentBranch(values[i]);
    }
  }

  if (stateStack.length) {
    throw new Error('Mismatched #if/#endif count');
  }

  return state.resolve();
}