var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/gl-matrix/dist/esm/common.js
var EPSILON = 1e-6;
var ANGLE_ORDER = "zyx";
var DEG_TO_RAD = Math.PI / 180;
var RAD_TO_DEG = 180 / Math.PI;

// node_modules/gl-matrix/dist/esm/mat3.js
var IDENTITY_3X3 = new Float32Array([
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1
]);
var Mat3 = class _Mat3 extends Float32Array {
  static {
    __name(this, "Mat3");
  }
  /**
   * The number of bytes in a {@link Mat3}.
   */
  static BYTE_LENGTH = 9 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat3}.
   */
  constructor(...values) {
    switch (values.length) {
      case 9:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 9);
        break;
      case 1:
        const v = values[0];
        if (typeof v === "number") {
          super([
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v
          ]);
        } else {
          super(v, 0, 9);
        }
        break;
      default:
        super(IDENTITY_3X3);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat3.str(this);`
   */
  get str() {
    return _Mat3.str(this);
  }
  //===================
  // Instance methods
  //===================
  /**
   * Copy the values from another {@link Mat3} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat3.identity(this)
   *
   * @returns `this`
   */
  identity() {
    this.set(IDENTITY_3X3);
    return this;
  }
  /**
   * Multiplies this {@link Mat3} against another one
   * Equivalent to `Mat3.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(b) {
    return _Mat3.multiply(this, this, b);
  }
  /**
   * Alias for {@link Mat3.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Transpose this {@link Mat3}
   * Equivalent to `Mat3.transpose(this, this);`
   *
   * @returns `this`
   */
  transpose() {
    return _Mat3.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat3}
   * Equivalent to `Mat4.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return _Mat3.invert(this, this);
  }
  /**
   * Translate this {@link Mat3} by the given vector
   * Equivalent to `Mat3.translate(this, this, v);`
   *
   * @param v - The {@link Vec2} to translate by
   * @returns `this`
   */
  translate(v) {
    return _Mat3.translate(this, this, v);
  }
  /**
   * Rotates this {@link Mat3} by the given angle around the given axis
   * Equivalent to `Mat3.rotate(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  rotate(rad) {
    return _Mat3.rotate(this, this, rad);
  }
  /**
   * Scales this {@link Mat3} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat3.scale(this, this, v);`
   *
   * @param v - The {@link Vec2} to scale the matrix by
   * @returns `this`
   */
  scale(v) {
    return _Mat3.scale(this, this, v);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat3}
   * @category Static
   *
   * @returns A new {@link Mat3}
   */
  static create() {
    return new _Mat3();
  }
  /**
   * Creates a new {@link Mat3} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat3}
   */
  static clone(a) {
    return new _Mat3(a);
  }
  /**
   * Copy the values from one {@link Mat3} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  /**
   * Create a new {@link Mat3} with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat3}
   */
  static fromValues(...values) {
    return new _Mat3(...values);
  }
  /**
   * Set the components of a {@link Mat3} to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(out, ...values) {
    out[0] = values[0];
    out[1] = values[1];
    out[2] = values[2];
    out[3] = values[3];
    out[4] = values[4];
    out[5] = values[5];
    out[6] = values[6];
    out[7] = values[7];
    out[8] = values[8];
    return out;
  }
  /**
   * Set a {@link Mat3} to the identity matrix
   * @category Static
   *
   * @param out - The receiving matrix
   * @returns `out`
   */
  static identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  /**
   * Transpose the values of a {@link Mat3}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(out, a) {
    if (out === a) {
      const a01 = a[1], a02 = a[2], a12 = a[5];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a01;
      out[5] = a[7];
      out[6] = a02;
      out[7] = a12;
    } else {
      out[0] = a[0];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a[1];
      out[4] = a[4];
      out[5] = a[7];
      out[6] = a[2];
      out[7] = a[5];
      out[8] = a[8];
    }
    return out;
  }
  /**
   * Inverts a {@link Mat3}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertable
   */
  static invert(out, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2];
    const a10 = a[3], a11 = a[4], a12 = a[5];
    const a20 = a[6], a21 = a[7], a22 = a[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a {@link Mat3}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(out, a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];
    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];
    out[0] = a11 * a22 - a12 * a21;
    out[1] = a02 * a21 - a01 * a22;
    out[2] = a01 * a12 - a02 * a11;
    out[3] = a12 * a20 - a10 * a22;
    out[4] = a00 * a22 - a02 * a20;
    out[5] = a02 * a10 - a00 * a12;
    out[6] = a10 * a21 - a11 * a20;
    out[7] = a01 * a20 - a00 * a21;
    out[8] = a00 * a11 - a01 * a10;
    return out;
  }
  /**
   * Calculates the determinant of a {@link Mat3}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];
    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  /**
   * Adds two {@link Mat3}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    return out;
  }
  /**
   * Alias for {@link Mat3.subtract}
   * @category Static
   */
  static sub(out, a, b) {
    return out;
  }
  /**
   * Multiplies two {@link Mat3}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];
    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22;
    b0 = b[3];
    b1 = b[4];
    b2 = b[5];
    out[3] = b0 * a00 + b1 * a10 + b2 * a20;
    out[4] = b0 * a01 + b1 * a11 + b2 * a21;
    out[5] = b0 * a02 + b1 * a12 + b2 * a22;
    b0 = b[6];
    b1 = b[7];
    b2 = b[8];
    out[6] = b0 * a00 + b1 * a10 + b2 * a20;
    out[7] = b0 * a01 + b1 * a11 + b2 * a21;
    out[8] = b0 * a02 + b1 * a12 + b2 * a22;
    return out;
  }
  /**
   * Alias for {@link Mat3.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return out;
  }
  /**
   * Translate a {@link Mat3} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(out, a, v) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];
    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];
    const x = v[0];
    const y = v[1];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
  }
  /**
   * Rotates a {@link Mat3} by the given angle
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotate(out, a, rad) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];
    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;
    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
  }
  /**
   * Scales the {@link Mat3} by the dimensions in the given {@link Vec2}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec2} to scale the matrix by
   * @returns `out`
   **/
  static scale(out, a, v) {
    const x = v[0];
    const y = v[1];
    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];
    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  /**
   * Creates a {@link Mat3} from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat3} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat3} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   * @category Static
   *
   * @param out - {@link Mat3} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromRotation(out, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = -s;
    out[4] = c;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat3} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat3} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }
  /**
   * Copies the upper-left 3x3 values of a {@link Mat2d} into the given
   * {@link Mat3}.
   * @category Static
   *
   * @param out - the receiving 3x3 matrix
   * @param a - the source 2x3 matrix
   * @returns `out`
   */
  static fromMat2d(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;
    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;
    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
  }
  /**
   * Calculates a {@link Mat3} from the given quaternion
   *
   * @param out - {@link Mat3} receiving operation result
   * @param q - {@link Quat} to create matrix from
   * @returns `out`
   */
  static fromQuat(out, q) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;
    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;
    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
  }
  /**
   * Copies the upper-left 3x3 values of a {@link Mat4} into the given
   * {@link Mat3}.
   * @category Static
   *
   * @param out - the receiving 3x3 matrix
   * @param a - the source 4x4 matrix
   * @returns `out`
   */
  static fromMat4(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
  }
  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
   * @category Static
   *
   * @param {mat3} out mat3 receiving operation result
   * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
   * @returns `out` or `null` if the matrix is not invertable
   */
  static normalFromMat4(out, a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }
  /**
   * Calculates a {@link Mat3} normal matrix (transpose inverse) from a {@link Mat4}
   * This version omits the calculation of the constant factor (1/determinant), so
   * any normals transformed with it will need to be renormalized.
   * From https://stackoverflow.com/a/27616419/25968
   * @category Static
   *
   * @param out - Matrix receiving operation result
   * @param a - Mat4 to derive the normal matrix from
   * @returns `out`
   */
  static normalFromMat4Fast(out, a) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = a[4];
    const by = a[5];
    const bz = a[6];
    const cx = a[8];
    const cy = a[9];
    const cz = a[10];
    out[0] = by * cz - cz * cy;
    out[1] = bz * cx - cx * cz;
    out[2] = bx * cy - cy * cx;
    out[3] = cy * az - cz * ay;
    out[4] = cz * ax - cx * az;
    out[5] = cx * ay - cy * ax;
    out[6] = ay * bz - az * by;
    out[7] = az * bx - ax * bz;
    out[8] = ax * by - ay * bx;
    return out;
  }
  /**
   * Generates a 2D projection matrix with the given bounds
   * @category Static
   *
   * @param out mat3 frustum matrix will be written into
   * @param width Width of your gl context
   * @param height Height of gl context
   * @returns `out`
   */
  static projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Returns Frobenius norm of a {@link Mat3}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8]);
  }
  /**
   * Multiply each element of a {@link Mat3} by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    return out;
  }
  /**
   * Adds two {@link Mat3}'s after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    return out;
  }
  /**
   * Returns whether or not two {@link Mat3}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
  }
  /**
   * Returns whether or not two {@link Mat3}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const a3 = a[3];
    const a4 = a[4];
    const a5 = a[5];
    const a6 = a[6];
    const a7 = a[7];
    const a8 = a[8];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    const b3 = b[3];
    const b4 = b[4];
    const b5 = b[5];
    const b6 = b[6];
    const b7 = b[7];
    const b8 = b[8];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8));
  }
  /**
   * Returns a string representation of a {@link Mat3}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(a) {
    return `Mat3(${a.join(", ")})`;
  }
};
Mat3.prototype.mul = Mat3.prototype.multiply;
Mat3.mul = Mat3.multiply;
Mat3.sub = Mat3.subtract;

// node_modules/gl-matrix/dist/esm/mat4.js
var IDENTITY_4X4 = new Float32Array([
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1
]);
var Mat4 = class _Mat4 extends Float32Array {
  static {
    __name(this, "Mat4");
  }
  /**
   * The number of bytes in a {@link Mat4}.
   */
  static BYTE_LENGTH = 16 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat4}.
   */
  constructor(...values) {
    switch (values.length) {
      case 16:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 16);
        break;
      case 1:
        const v = values[0];
        if (typeof v === "number") {
          super([
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v,
            v
          ]);
        } else {
          super(v, 0, 16);
        }
        break;
      default:
        super(IDENTITY_4X4);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat4.str(this);`
   */
  get str() {
    return _Mat4.str(this);
  }
  //===================
  // Instance methods
  //===================
  /**
   * Copy the values from another {@link Mat4} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat4.identity(this)
   *
   * @returns `this`
   */
  identity() {
    this.set(IDENTITY_4X4);
    return this;
  }
  /**
   * Multiplies this {@link Mat4} against another one
   * Equivalent to `Mat4.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(b) {
    return _Mat4.multiply(this, this, b);
  }
  /**
   * Alias for {@link Mat4.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Transpose this {@link Mat4}
   * Equivalent to `Mat4.transpose(this, this);`
   *
   * @returns `this`
   */
  transpose() {
    return _Mat4.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat4}
   * Equivalent to `Mat4.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return _Mat4.invert(this, this);
  }
  /**
   * Translate this {@link Mat4} by the given vector
   * Equivalent to `Mat4.translate(this, this, v);`
   *
   * @param v - The {@link Vec3} to translate by
   * @returns `this`
   */
  translate(v) {
    return _Mat4.translate(this, this, v);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the given axis
   * Equivalent to `Mat4.rotate(this, this, rad, axis);`
   *
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out`
   */
  rotate(rad, axis) {
    return _Mat4.rotate(this, this, rad, axis);
  }
  /**
   * Scales this {@link Mat4} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat4.scale(this, this, v);`
   *
   * @param v - The {@link Vec3} to scale the matrix by
   * @returns `this`
   */
  scale(v) {
    return _Mat4.scale(this, this, v);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the X axis
   * Equivalent to `Mat4.rotateX(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateX(rad) {
    return _Mat4.rotateX(this, this, rad);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Y axis
   * Equivalent to `Mat4.rotateY(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateY(rad) {
    return _Mat4.rotateY(this, this, rad);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Z axis
   * Equivalent to `Mat4.rotateZ(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateZ(rad) {
    return _Mat4.rotateZ(this, this, rad);
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveNO(this, fovy, aspect, near, far);`
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveNO(fovy, aspect, near, far) {
    return _Mat4.perspectiveNO(this, fovy, aspect, near, far);
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveZO(this, fovy, aspect, near, far);`
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveZO(fovy, aspect, near, far) {
    return _Mat4.perspectiveZO(this, fovy, aspect, near, far);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Equivalent to `Mat4.orthoNO(this, left, right, bottom, top, near, far);`
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoNO(left, right, bottom, top, near, far) {
    return _Mat4.orthoNO(this, left, right, bottom, top, near, far);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Equivalent to `Mat4.orthoZO(this, left, right, bottom, top, near, far);`
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoZO(left, right, bottom, top, near, far) {
    return _Mat4.orthoZO(this, left, right, bottom, top, near, far);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat4}
   * @category Static
   *
   * @returns A new {@link Mat4}
   */
  static create() {
    return new _Mat4();
  }
  /**
   * Creates a new {@link Mat4} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat4}
   */
  static clone(a) {
    return new _Mat4(a);
  }
  /**
   * Copy the values from one {@link Mat4} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Create a new mat4 with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat4}
   */
  static fromValues(...values) {
    return new _Mat4(...values);
  }
  /**
   * Set the components of a mat4 to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(out, ...values) {
    out[0] = values[0];
    out[1] = values[1];
    out[2] = values[2];
    out[3] = values[3];
    out[4] = values[4];
    out[5] = values[5];
    out[6] = values[6];
    out[7] = values[7];
    out[8] = values[8];
    out[9] = values[9];
    out[10] = values[10];
    out[11] = values[11];
    out[12] = values[12];
    out[13] = values[13];
    out[14] = values[14];
    out[15] = values[15];
    return out;
  }
  /**
   * Set a {@link Mat4} to the identity matrix
   * @category Static
   *
   * @param out - The receiving Matrix
   * @returns `out`
   */
  static identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Transpose the values of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(out, a) {
    if (out === a) {
      const a01 = a[1], a02 = a[2], a03 = a[3];
      const a12 = a[6], a13 = a[7];
      const a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  /**
   * Inverts a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out` or `null` if the matrix is not invertable
   */
  static invert(out, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(out, a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    out[0] = a11 * b11 - a12 * b10 + a13 * b09;
    out[1] = a02 * b10 - a01 * b11 - a03 * b09;
    out[2] = a31 * b05 - a32 * b04 + a33 * b03;
    out[3] = a22 * b04 - a21 * b05 - a23 * b03;
    out[4] = a12 * b08 - a10 * b11 - a13 * b07;
    out[5] = a00 * b11 - a02 * b08 + a03 * b07;
    out[6] = a32 * b02 - a30 * b05 - a33 * b01;
    out[7] = a20 * b05 - a22 * b02 + a23 * b01;
    out[8] = a10 * b10 - a11 * b08 + a13 * b06;
    out[9] = a01 * b08 - a00 * b10 - a03 * b06;
    out[10] = a30 * b04 - a31 * b02 + a33 * b00;
    out[11] = a21 * b02 - a20 * b04 - a23 * b00;
    out[12] = a11 * b07 - a10 * b09 - a12 * b06;
    out[13] = a00 * b09 - a01 * b07 + a02 * b06;
    out[14] = a31 * b01 - a30 * b03 - a32 * b00;
    out[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return out;
  }
  /**
   * Calculates the determinant of a {@link Mat4}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b0 = a00 * a11 - a01 * a10;
    const b1 = a00 * a12 - a02 * a10;
    const b2 = a01 * a12 - a02 * a11;
    const b3 = a20 * a31 - a21 * a30;
    const b4 = a20 * a32 - a22 * a30;
    const b5 = a21 * a32 - a22 * a31;
    const b6 = a00 * b5 - a01 * b4 + a02 * b3;
    const b7 = a10 * b5 - a11 * b4 + a12 * b3;
    const b8 = a20 * b2 - a21 * b1 + a22 * b0;
    const b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  /**
   * Multiplies two {@link Mat4}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  /**
   * Alias for {@link Mat4.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return out;
  }
  /**
   * Translate a {@link Mat4} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(out, a, v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      const a00 = a[0];
      const a01 = a[1];
      const a02 = a[2];
      const a03 = a[3];
      const a10 = a[4];
      const a11 = a[5];
      const a12 = a[6];
      const a13 = a[7];
      const a20 = a[8];
      const a21 = a[9];
      const a22 = a[10];
      const a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  /**
   * Scales the {@link Mat4} by the dimensions in the given {@link Vec3} not using vectorization
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec3} to scale the matrix by
   * @returns `out`
   **/
  static scale(out, a, v) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  /**
   * Rotates a {@link Mat4} by the given angle around the given axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out` or `null` if axis has a length of 0
   */
  static rotate(out, a, rad, axis) {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the X axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateX(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Y axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateY(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Z axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateZ(out, a, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out` or `null` if `axis` has a length of 0
   */
  static fromRotation(out, rad, axis) {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromXRotation(out, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromYRotation(out, rad) {
    let s = Math.sin(rad);
    let c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromZRotation(out, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @returns `out`
   */
  static fromRotationTranslation(out, q, v) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Sets a {@link Mat4} from a {@link Quat2}.
   * @category Static
   *
   * @param out - Matrix
   * @param a - Dual Quaternion
   * @returns `out`
   */
  static fromQuat2(out, a) {
    const bx = -a[0];
    const by = -a[1];
    const bz = -a[2];
    const bw = a[3];
    const ax = a[4];
    const ay = a[5];
    const az = a[6];
    const aw = a[7];
    let magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      tmpVec3[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      tmpVec3[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      tmpVec3[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      tmpVec3[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      tmpVec3[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      tmpVec3[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    _Mat4.fromRotationTranslation(out, a, tmpVec3);
    return out;
  }
  /**
   * Calculates a {@link Mat4} normal matrix (transpose inverse) from a {@link Mat4}
   * @category Static
   *
   * @param out - Matrix receiving operation result
   * @param a - Mat4 to derive the normal matrix from
   * @returns `out` or `null` if the matrix is not invertable
   */
  static normalFromMat4(out, a) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = 0;
    out[4] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[7] = 0;
    out[8] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[9] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Calculates a {@link Mat4} normal matrix (transpose inverse) from a {@link Mat4}
   * This version omits the calculation of the constant factor (1/determinant), so
   * any normals transformed with it will need to be renormalized.
   * From https://stackoverflow.com/a/27616419/25968
   * @category Static
   *
   * @param out - Matrix receiving operation result
   * @param a - Mat4 to derive the normal matrix from
   * @returns `out`
   */
  static normalFromMat4Fast(out, a) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = a[4];
    const by = a[5];
    const bz = a[6];
    const cx = a[8];
    const cy = a[9];
    const cz = a[10];
    out[0] = by * cz - cz * cy;
    out[1] = bz * cx - cx * cz;
    out[2] = bx * cy - cy * cx;
    out[3] = 0;
    out[4] = cy * az - cz * ay;
    out[5] = cz * ax - cx * az;
    out[6] = cx * ay - cy * ax;
    out[7] = 0;
    out[8] = ay * bz - az * by;
    out[9] = az * bx - ax * bz;
    out[10] = ax * by - ay * bx;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Returns the translation vector component of a transformation
   * matrix. If a matrix is built with fromRotationTranslation,
   * the returned vector will be the same as the translation vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive translation component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  /**
   * Returns the scaling factor component of a transformation
   * matrix. If a matrix is built with fromRotationTranslationScale
   * with a normalized Quaternion parameter, the returned vector will be
   * the same as the scaling vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getScaling(out, mat) {
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  /**
   * Returns a quaternion representing the rotational component
   * of a transformation matrix. If a matrix is built with
   * fromRotationTranslation, the returned quaternion will be the
   * same as the quaternion originally supplied.
   * @category Static
   *
   * @param out - Quaternion to receive the rotation component
   * @param mat - Matrix to be decomposed (input)
   * @return `out`
   */
  static getRotation(out, mat) {
    _Mat4.getScaling(tmpVec3, mat);
    const is1 = 1 / tmpVec3[0];
    const is2 = 1 / tmpVec3[1];
    const is3 = 1 / tmpVec3[2];
    const sm11 = mat[0] * is1;
    const sm12 = mat[1] * is2;
    const sm13 = mat[2] * is3;
    const sm21 = mat[4] * is1;
    const sm22 = mat[5] * is2;
    const sm23 = mat[6] * is3;
    const sm31 = mat[8] * is1;
    const sm32 = mat[9] * is2;
    const sm33 = mat[10] * is3;
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  /**
   * Decomposes a transformation matrix into its rotation, translation
   * and scale components. Returns only the rotation component
   * @category Static
   *
   * @param out_r - Quaternion to receive the rotation component
   * @param out_t - Vector to receive the translation vector
   * @param out_s - Vector to receive the scaling factor
   * @param mat - Matrix to be decomposed (input)
   * @returns `out_r`
   */
  static decompose(out_r, out_t, out_s, mat) {
    out_t[0] = mat[12];
    out_t[1] = mat[13];
    out_t[2] = mat[14];
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    const is1 = 1 / out_s[0];
    const is2 = 1 / out_s[1];
    const is3 = 1 / out_s[2];
    const sm11 = m11 * is1;
    const sm12 = m12 * is2;
    const sm13 = m13 * is3;
    const sm21 = m21 * is1;
    const sm22 = m22 * is2;
    const sm23 = m23 * is3;
    const sm31 = m31 * is1;
    const sm32 = m32 * is2;
    const sm33 = m33 * is3;
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out_r[3] = 0.25 * S;
      out_r[0] = (sm23 - sm32) / S;
      out_r[1] = (sm31 - sm13) / S;
      out_r[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out_r[3] = (sm23 - sm32) / S;
      out_r[0] = 0.25 * S;
      out_r[1] = (sm12 + sm21) / S;
      out_r[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out_r[3] = (sm31 - sm13) / S;
      out_r[0] = (sm12 + sm21) / S;
      out_r[1] = 0.25 * S;
      out_r[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out_r[3] = (sm12 - sm21) / S;
      out_r[0] = (sm31 + sm13) / S;
      out_r[1] = (sm23 + sm32) / S;
      out_r[2] = 0.25 * S;
    }
    return out_r;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @returns `out`
   */
  static fromRotationTranslationScale(out, q, v, s) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     mat4.translate(dest, origin);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *     mat4.translate(dest, negativeOrigin);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @param o - The origin vector around which to scale and rotate
   * @returns `out`
   */
  static fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];
    const ox = o[0];
    const oy = o[1];
    const oz = o[2];
    const out0 = (1 - (yy + zz)) * sx;
    const out1 = (xy + wz) * sx;
    const out2 = (xz - wy) * sx;
    const out4 = (xy - wz) * sy;
    const out5 = (1 - (xx + zz)) * sy;
    const out6 = (yz + wx) * sy;
    const out8 = (xz + wy) * sz;
    const out9 = (yz - wx) * sz;
    const out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  /**
   * Calculates a 4x4 matrix from the given quaternion
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Quaternion to create matrix from
   * @returns `out`
   */
  static fromQuat(out, q) {
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a frustum matrix with the given bounds
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far -  Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static frustumNO(out, left, right, bottom, top, near, far = Infinity) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  /**
   * Alias for {@link Mat4.frustumNO}
   * @category Static
   * @deprecated Use {@link Mat4.frustumNO} or {@link Mat4.frustumZO} explicitly
   */
  static frustum(out, left, right, bottom, top, near, far = Infinity) {
    return out;
  }
  /**
   * Generates a frustum matrix with the given bounds
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static frustumZO(out, left, right, bottom, top, near, far = Infinity) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveNO(out, fovy, aspect, near, far = Infinity) {
    const f = 1 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  /**
   * Alias for {@link Mat4.perspectiveNO}
   * @category Static
   * @deprecated Use {@link Mat4.perspectiveNO} or {@link Mat4.perspectiveZO} explicitly
   */
  static perspective(out, fovy, aspect, near, far = Infinity) {
    return out;
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveZO(out, fovy, aspect, near, far = Infinity) {
    const f = 1 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given field of view.
   * This is primarily useful for generating projection matrices to be used
   * with the still experiemental WebVR API.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fov - Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   * @deprecated
   */
  static perspectiveFromFieldOfView(out, fov, near, far) {
    const upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    const downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    const leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    const rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    const xScale = 2 / (leftTan + rightTan);
    const yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoNO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Alias for {@link Mat4.orthoNO}
   * @category Static
   * @deprecated Use {@link Mat4.orthoNO} or {@link Mat4.orthoZO} explicitly
   */
  static ortho(out, left, right, bottom, top, near, far) {
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoZO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param center - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static lookAt(out, eye, center, up) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return _Mat4.identity(out);
    }
    let z0 = eyex - centerx;
    let z1 = eyey - centery;
    let z2 = eyez - centerz;
    let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    let y0 = z1 * x2 - z2 * x1;
    let y1 = z2 * x0 - z0 * x2;
    let y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  /**
   * Generates a matrix that makes something look at something else.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param target - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static targetTo(out, eye, target, up) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    let z0 = eyex - target[0];
    let z1 = eyey - target[1];
    let z2 = eyez - target[2];
    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  /**
   * Returns Frobenius norm of a {@link Mat4}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8] + a[9] * a[9] + a[10] * a[10] + a[11] * a[11] + a[12] * a[12] + a[13] * a[13] + a[14] * a[14] + a[15] * a[15]);
  }
  /**
   * Adds two {@link Mat4}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  /**
   * Alias for {@link Mat4.subtract}
   * @category Static
   */
  static sub(out, a, b) {
    return out;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    out[4] = a[4] + b[4] * scale;
    out[5] = a[5] + b[5] * scale;
    out[6] = a[6] + b[6] * scale;
    out[7] = a[7] + b[7] * scale;
    out[8] = a[8] + b[8] * scale;
    out[9] = a[9] + b[9] * scale;
    out[10] = a[10] + b[10] * scale;
    out[11] = a[11] + b[11] * scale;
    out[12] = a[12] + b[12] * scale;
    out[13] = a[13] + b[13] * scale;
    out[14] = a[14] + b[14] * scale;
    out[15] = a[15] + b[15] * scale;
    return out;
  }
  /**
   * Returns whether or not two {@link Mat4}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  /**
   * Returns whether or not two {@link Mat4}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const a3 = a[3];
    const a4 = a[4];
    const a5 = a[5];
    const a6 = a[6];
    const a7 = a[7];
    const a8 = a[8];
    const a9 = a[9];
    const a10 = a[10];
    const a11 = a[11];
    const a12 = a[12];
    const a13 = a[13];
    const a14 = a[14];
    const a15 = a[15];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    const b3 = b[3];
    const b4 = b[4];
    const b5 = b[5];
    const b6 = b[6];
    const b7 = b[7];
    const b8 = b[8];
    const b9 = b[9];
    const b10 = b[10];
    const b11 = b[11];
    const b12 = b[12];
    const b13 = b[13];
    const b14 = b[14];
    const b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  /**
   * Returns a string representation of a {@link Mat4}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(a) {
    return `Mat4(${a.join(", ")})`;
  }
};
var tmpVec3 = new Float32Array(3);
Mat4.prototype.mul = Mat4.prototype.multiply;
Mat4.sub = Mat4.subtract;
Mat4.mul = Mat4.multiply;
Mat4.frustum = Mat4.frustumNO;
Mat4.perspective = Mat4.perspectiveNO;
Mat4.ortho = Mat4.orthoNO;

// node_modules/gl-matrix/dist/esm/vec3.js
var Vec3 = class _Vec3 extends Float32Array {
  static {
    __name(this, "Vec3");
  }
  /**
  * The number of bytes in a {@link Vec3}.
  */
  static BYTE_LENGTH = 3 * Float32Array.BYTES_PER_ELEMENT;
  /**
  * Create a {@link Vec3}.
  */
  constructor(...values) {
    switch (values.length) {
      case 3:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 3);
        break;
      case 1: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, v, v]);
        } else {
          super(v, 0, 3);
        }
        break;
      }
      default:
        super(3);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  /**
   * The z component of the vector. Equivalent to `this[2];`
   * @category Vector components
   */
  get z() {
    return this[2];
  }
  set z(value) {
    this[2] = value;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(value) {
    this[0] = value;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(value) {
    this[1] = value;
  }
  /**
   * The b component of the vector. Equivalent to `this[2];`
   * @category Color components
   */
  get b() {
    return this[2];
  }
  set b(value) {
    this[2] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec3.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec3.squaredMagnitude(this);`
   */
  get squaredMagnitude() {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    return x * x + y * y + z * z;
  }
  /**
   * Alias for {@link Vec3.squaredMagnitude}
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec3.str(this);`
   */
  get str() {
    return _Vec3.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec3} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  /**
   * Adds a {@link Vec3} to `this`.
   * Equivalent to `Vec3.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(b) {
    this[0] += b[0];
    this[1] += b[1];
    this[2] += b[2];
    return this;
  }
  /**
   * Subtracts a {@link Vec3} from `this`.
   * Equivalent to `Vec3.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(b) {
    this[0] -= b[0];
    this[1] -= b[1];
    this[2] -= b[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.subtract}
   */
  sub(b) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec3}.
   * Equivalent to `Vec3.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b) {
    this[0] *= b[0];
    this[1] *= b[1];
    this[2] *= b[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec3}.
   * Equivalent to `Vec3.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns `this`
   */
  divide(b) {
    this[0] /= b[0];
    this[1] /= b[1];
    this[2] /= b[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.divide}
   */
  div(b) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec3.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(b) {
    this[0] *= b;
    this[1] *= b;
    this[2] *= b;
    return this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec3.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(b, scale) {
    this[0] += b[0] * scale;
    this[1] += b[1] * scale;
    this[2] += b[2] * scale;
    return this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(b) {
    return _Vec3.distance(this, b);
  }
  /**
   * Alias for {@link Vec3.distance}
   */
  dist(b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(b) {
    return _Vec3.squaredDistance(this, b);
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   */
  sqrDist(b) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec3.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    return this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec3.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    return this;
  }
  /**
   * Sets each component of `this` to it's absolute value.
   * Equivalent to `Vec3.abs(this, this);`
   *
   * @returns `this`
   */
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    return this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec3}.
   * Equivalent to `Vec3.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(b) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec3.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return _Vec3.normalize(this, this);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, empty vec3
   * @category Static
   *
   * @returns a new 3D vector
   */
  static create() {
    return new _Vec3();
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 3D vector
   */
  static clone(a) {
    return new _Vec3(a);
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec3}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(a) {
    let x = a[0];
    let y = a[1];
    let z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   */
  static mag(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.mag}
   */
  static len(a) {
    return 0;
  }
  /**
   * Creates a new vec3 initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns a new 3D vector
   */
  static fromValues(x, y, z) {
    return new _Vec3(x, y, z);
  }
  /**
   * Copy the values from one vec3 to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the source vector
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  /**
   * Set the components of a vec3 to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns `out`
   */
  static set(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Adds two {@link Vec3}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.subtract}
   * @category Static
   */
  static sub(out, a, b) {
    return [0, 0, 0];
  }
  /**
   * Multiplies two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return [0, 0, 0];
  }
  /**
   * Divides two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.divide}
   * @category Static
   */
  static div(out, a, b) {
    return [0, 0, 0];
  }
  /**
   * Math.ceil the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to ceil
   * @returns `out`
   */
  static ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  /**
   * Math.floor the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to floor
   * @returns `out`
   */
  static floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  /**
   * Returns the minimum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  /**
   * Returns the maximum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  /**
   * symmetric round the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to round
   * @returns `out`
   */
  /*static round(out: Vec3Like, a: Readonly<Vec3Like>): Vec3Like {
    out[0] = glMatrix.round(a[0]);
    out[1] = glMatrix.round(a[1]);
    out[2] = glMatrix.round(a[2]);
    return out;
  }*/
  /**
   * Scales a vec3 by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a, scale) {
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    out[2] = a[2] * scale;
    return out;
  }
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns distance between a and b
   */
  static distance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * Alias for {@link Vec3.distance}
   */
  static dist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns squared distance between a and b
   */
  static squaredDistance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   */
  static sqrDist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared length of a vec3
   * @category Static
   *
   * @param a - vector to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    return x * x + y * y + z * z;
  }
  /**
   * Alias for {@link Vec3.squaredLength}
   */
  static sqrLen(a, b) {
    return 0;
  }
  /**
   * Negates the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to negate
   * @returns `out`
   */
  static negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  /**
   * Returns the inverse of the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to invert
   * @returns `out`
   */
  static inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec3}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(out, a) {
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    out[2] = Math.abs(a[2]);
    return out;
  }
  /**
   * Normalize a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to normalize
   * @returns `out`
   */
  static normalize(out, a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static cross(out, a, b) {
    const ax = a[0], ay = a[1], az = a[2];
    const bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Performs a linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a, b, t) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static slerp(out, a, b, t) {
    const angle = Math.acos(Math.min(Math.max(_Vec3.dot(a, b), -1), 1));
    const sinTotal = Math.sin(angle);
    const ratioA = Math.sin((1 - t) * angle) / sinTotal;
    const ratioB = Math.sin(t * angle) / sinTotal;
    out[0] = ratioA * a[0] + ratioB * b[0];
    out[1] = ratioA * a[1] + ratioB * b[1];
    out[2] = ratioA * a[2] + ratioB * b[2];
    return out;
  }
  /**
   * Performs a hermite interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static hermite(out, a, b, c, d, t) {
    const factorTimes2 = t * t;
    const factor1 = factorTimes2 * (2 * t - 3) + 1;
    const factor2 = factorTimes2 * (t - 2) + t;
    const factor3 = factorTimes2 * (t - 1);
    const factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  /**
   * Performs a bezier interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static bezier(out, a, b, c, d, t) {
    const inverseFactor = 1 - t;
    const inverseFactorTimesTwo = inverseFactor * inverseFactor;
    const factorTimes2 = t * t;
    const factor1 = inverseFactorTimesTwo * inverseFactor;
    const factor2 = 3 * t * inverseFactorTimesTwo;
    const factor3 = 3 * factorTimes2 * inverseFactor;
    const factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  /**
   * Generates a random vector with the given scale
   * @category Static
   *
   * @param out - the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
   * @returns `out`
   */
  /*static random(out: Vec3Like, scale) {
      scale = scale === undefined ? 1.0 : scale;
  
      let r = glMatrix.RANDOM() * 2.0 * Math.PI;
      let z = glMatrix.RANDOM() * 2.0 - 1.0;
      let zScale = Math.sqrt(1.0 - z * z) * scale;
  
      out[0] = Math.cos(r) * zScale;
      out[1] = Math.sin(r) * zScale;
      out[2] = z * scale;
      return out;
    }*/
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - matrix to transform with
   * @returns `out`
   */
  static transformMat4(out, a, m) {
    const x = a[0], y = a[1], z = a[2];
    const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  /**
   * Transforms the vec3 with a mat3.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - the 3x3 matrix to transform with
   * @returns `out`
   */
  static transformMat3(out, a, m) {
    let x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  /**
   * Transforms the vec3 with a quat
   * Can also be used for dual quaternions. (Multiply it with the real part)
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param q - quaternion to transform with
   * @returns `out`
   */
  static transformQuat(out, a, q) {
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const w2 = q[3] * 2;
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const uvx = qy * z - qz * y;
    const uvy = qz * x - qx * z;
    const uvz = qx * y - qy * x;
    const uuvx = (qy * uvz - qz * uvy) * 2;
    const uuvy = (qz * uvx - qx * uvz) * 2;
    const uuvz = (qx * uvy - qy * uvx) * 2;
    out[0] = x + uvx * w2 + uuvx;
    out[1] = y + uvy * w2 + uuvy;
    out[2] = z + uvz * w2 + uuvz;
    return out;
  }
  /**
   * Rotate a 3D vector around the x-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateX(out, a, b, rad) {
    const by = b[1];
    const bz = b[2];
    const py = a[1] - by;
    const pz = a[2] - bz;
    out[0] = a[0];
    out[1] = py * Math.cos(rad) - pz * Math.sin(rad) + by;
    out[2] = py * Math.sin(rad) + pz * Math.cos(rad) + bz;
    return out;
  }
  /**
   * Rotate a 3D vector around the y-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateY(out, a, b, rad) {
    const bx = b[0];
    const bz = b[2];
    const px = a[0] - bx;
    const pz = a[2] - bz;
    out[0] = pz * Math.sin(rad) + px * Math.cos(rad) + bx;
    out[1] = a[1];
    out[2] = pz * Math.cos(rad) - px * Math.sin(rad) + bz;
    return out;
  }
  /**
   * Rotate a 3D vector around the z-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateZ(out, a, b, rad) {
    const bx = b[0];
    const by = b[1];
    const px = a[0] - bx;
    const py = a[1] - by;
    out[0] = px * Math.cos(rad) - py * Math.sin(rad) + bx;
    out[1] = px * Math.sin(rad) + py * Math.cos(rad) + by;
    out[2] = b[2];
    return out;
  }
  /**
   * Get the angle between two 3D vectors
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(a, b) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
    const cosine = mag && _Vec3.dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  /**
   * Set the components of a vec3 to zero
   * @category Static
   *
   * @param out - the receiving vector
   * @returns `out`
   */
  static zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(a) {
    return `Vec3(${a.join(", ")})`;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
};
Vec3.prototype.sub = Vec3.prototype.subtract;
Vec3.prototype.mul = Vec3.prototype.multiply;
Vec3.prototype.div = Vec3.prototype.divide;
Vec3.prototype.dist = Vec3.prototype.distance;
Vec3.prototype.sqrDist = Vec3.prototype.squaredDistance;
Vec3.sub = Vec3.subtract;
Vec3.mul = Vec3.multiply;
Vec3.div = Vec3.divide;
Vec3.dist = Vec3.distance;
Vec3.sqrDist = Vec3.squaredDistance;
Vec3.sqrLen = Vec3.squaredLength;
Vec3.mag = Vec3.magnitude;
Vec3.length = Vec3.magnitude;
Vec3.len = Vec3.magnitude;

// node_modules/gl-matrix/dist/esm/vec4.js
var Vec4 = class _Vec4 extends Float32Array {
  static {
    __name(this, "Vec4");
  }
  /**
   * The number of bytes in a {@link Vec4}.
   */
  static BYTE_LENGTH = 4 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Vec4}.
   */
  constructor(...values) {
    switch (values.length) {
      case 4:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 4);
        break;
      case 1: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, v, v, v]);
        } else {
          super(v, 0, 4);
        }
        break;
      }
      default:
        super(4);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  /**
   * The z component of the vector. Equivalent to `this[2];`
   * @category Vector components
   */
  get z() {
    return this[2];
  }
  set z(value) {
    this[2] = value;
  }
  /**
   * The w component of the vector. Equivalent to `this[3];`
   * @category Vector components
   */
  get w() {
    return this[3];
  }
  set w(value) {
    this[3] = value;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(value) {
    this[0] = value;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(value) {
    this[1] = value;
  }
  /**
   * The b component of the vector. Equivalent to `this[2];`
   * @category Color components
   */
  get b() {
    return this[2];
  }
  set b(value) {
    this[2] = value;
  }
  /**
   * The a component of the vector. Equivalent to `this[3];`
   * @category Color components
   */
  get a() {
    return this[3];
  }
  set a(value) {
    this[3] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec4.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * Alias for {@link Vec4.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec4.str(this);`
   */
  get str() {
    return _Vec4.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec4} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    super.set(a);
    return this;
  }
  /**
   * Adds a {@link Vec4} to `this`.
   * Equivalent to `Vec4.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(b) {
    this[0] += b[0];
    this[1] += b[1];
    this[2] += b[2];
    this[3] += b[3];
    return this;
  }
  /**
   * Subtracts a {@link Vec4} from `this`.
   * Equivalent to `Vec4.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(b) {
    this[0] -= b[0];
    this[1] -= b[1];
    this[2] -= b[2];
    this[3] -= b[3];
    return this;
  }
  /**
   * Alias for {@link Vec4.subtract}
   */
  sub(b) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec4}.
   * Equivalent to `Vec4.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b) {
    this[0] *= b[0];
    this[1] *= b[1];
    this[2] *= b[2];
    this[3] *= b[3];
    return this;
  }
  /**
   * Alias for {@link Vec4.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec4}.
   * Equivalent to `Vec4.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns `this`
   */
  divide(b) {
    this[0] /= b[0];
    this[1] /= b[1];
    this[2] /= b[2];
    this[3] /= b[3];
    return this;
  }
  /**
   * Alias for {@link Vec4.divide}
   */
  div(b) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec4.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(b) {
    this[0] *= b;
    this[1] *= b;
    this[2] *= b;
    this[3] *= b;
    return this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec4.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(b, scale) {
    this[0] += b[0] * scale;
    this[1] += b[1] * scale;
    this[2] += b[2] * scale;
    this[3] += b[3] * scale;
    return this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec4} and `this`.
   * Equivalent to `Vec4.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(b) {
    return _Vec4.distance(this, b);
  }
  /**
   * Alias for {@link Vec4.distance}
   */
  dist(b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec4} and `this`.
   * Equivalent to `Vec4.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(b) {
    return _Vec4.squaredDistance(this, b);
  }
  /**
   * Alias for {@link Vec4.squaredDistance}
   */
  sqrDist(b) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec4.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    this[3] *= -1;
    return this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec4.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    this[3] = 1 / this[3];
    return this;
  }
  /**
   * Sets each component of `this` to it's absolute value.
   * Equivalent to `Vec4.abs(this, this);`
   *
   * @returns `this`
   */
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    this[3] = Math.abs(this[3]);
    return this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec4}.
   * Equivalent to `Vec4.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(b) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3] * b[3];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec4.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return _Vec4.normalize(this, this);
  }
  //===================
  // Static methods
  //===================
  /**
   * Creates a new, empty {@link Vec4}
   * @category Static
   *
   * @returns a new 4D vector
   */
  static create() {
    return new _Vec4();
  }
  /**
   * Creates a new {@link Vec4} initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 4D vector
   */
  static clone(a) {
    return new _Vec4(a);
  }
  /**
   * Creates a new {@link Vec4} initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns a new 4D vector
   */
  static fromValues(x, y, z, w) {
    return new _Vec4(x, y, z, w);
  }
  /**
   * Copy the values from one {@link Vec4} to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the source vector
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Set the components of a {@link Vec4} to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns `out`
   */
  static set(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  /**
   * Adds two {@link Vec4}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
  }
  /**
   * Alias for {@link Vec4.subtract}
   * @category Static
   */
  static sub(out, a, b) {
    return out;
  }
  /**
   * Multiplies two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
  }
  /**
   * Alias for {@link Vec4.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return out;
  }
  /**
   * Divides two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
  }
  /**
   * Alias for {@link Vec4.divide}
   * @category Static
   */
  static div(out, a, b) {
    return out;
  }
  /**
   * Math.ceil the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to ceil
   * @returns `out`
   */
  static ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    out[3] = Math.ceil(a[3]);
    return out;
  }
  /**
   * Math.floor the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to floor
   * @returns `out`
   */
  static floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    out[3] = Math.floor(a[3]);
    return out;
  }
  /**
   * Returns the minimum of two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
  }
  /**
   * Returns the maximum of two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
  }
  /**
   * Math.round the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to round
   * @returns `out`
   */
  static round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    out[3] = Math.round(a[3]);
    return out;
  }
  /**
   * Scales a {@link Vec4} by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a, scale) {
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    out[2] = a[2] * scale;
    out[3] = a[3] * scale;
    return out;
  }
  /**
   * Adds two {@link Vec4}'s after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    out[3] = a[3] + b[3] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two {@link Vec4}'s
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns distance between a and b
   */
  static distance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    const w = b[3] - a[3];
    return Math.hypot(x, y, z, w);
  }
  /**
   * Alias for {@link Vec4.distance}
   * @category Static
   */
  static dist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two {@link Vec4}'s
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns squared distance between a and b
   */
  static squaredDistance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    const w = b[3] - a[3];
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Alias for {@link Vec4.squaredDistance}
   * @category Static
   */
  static sqrDist(a, b) {
    return 0;
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec4}
   * @category Static
   *
   * @param a - vector to calculate length of
   * @returns length of `a`
   */
  static magnitude(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const w = a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * Alias for {@link Vec4.magnitude}
   * @category Static
   */
  static mag(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec4.magnitude}
   * @category Static
   * @deprecated Use {@link Vec4.magnitude} to avoid conflicts with builtin `length` methods/attribs
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec4.magnitude}
   * @category Static
   * @deprecated Use {@link Vec4.mag}
   */
  static len(a) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Vec4}
   * @category Static
   *
   * @param a - vector to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const w = a[3];
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Alias for {@link Vec4.squaredLength}
   * @category Static
   */
  static sqrLen(a) {
    return 0;
  }
  /**
   * Negates the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to negate
   * @returns `out`
   */
  static negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
  }
  /**
   * Returns the inverse of the components of a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to invert
   * @returns `out`
   */
  static inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    out[3] = 1 / a[3];
    return out;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec4}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(out, a) {
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    out[2] = Math.abs(a[2]);
    out[3] = Math.abs(a[3]);
    return out;
  }
  /**
   * Normalize a {@link Vec4}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to normalize
   * @returns `out`
   */
  static normalize(out, a) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const w = a[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  /**
   * Calculates the dot product of two {@link Vec4}'s
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  /**
   * Returns the cross-product of three vectors in a 4-dimensional space
   * @category Static
   *
   * @param out the receiving vector
   * @param u - the first vector
   * @param v - the second vector
   * @param w - the third vector
   * @returns result
   */
  static cross(out, u, v, w) {
    const a = v[0] * w[1] - v[1] * w[0];
    const b = v[0] * w[2] - v[2] * w[0];
    const c = v[0] * w[3] - v[3] * w[0];
    const d = v[1] * w[2] - v[2] * w[1];
    const e = v[1] * w[3] - v[3] * w[1];
    const f = v[2] * w[3] - v[3] * w[2];
    const g = u[0];
    const h = u[1];
    const i = u[2];
    const j = u[3];
    out[0] = h * f - i * e + j * d;
    out[1] = -(g * f) + i * c - j * b;
    out[2] = g * e - h * c + j * a;
    out[3] = -(g * d) + h * b - i * a;
    return out;
  }
  /**
   * Performs a linear interpolation between two {@link Vec4}'s
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a, b, t) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
  }
  /**
   * Generates a random vector with the given scale
   * @category Static
   *
   * @param out - the receiving vector
   * @param [scale] - Length of the resulting vector. If ommitted, a unit vector will be returned
   * @returns `out`
   */
  /*static random(out: Vec4Like, scale): Vec4Like {
      scale = scale || 1.0;
  
      // Marsaglia, George. Choosing a Point from the Surface of a
      // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
      // http://projecteuclid.org/euclid.aoms/1177692644;
      var v1, v2, v3, v4;
      var s1, s2;
      do {
        v1 = glMatrix.RANDOM() * 2 - 1;
        v2 = glMatrix.RANDOM() * 2 - 1;
        s1 = v1 * v1 + v2 * v2;
      } while (s1 >= 1);
      do {
        v3 = glMatrix.RANDOM() * 2 - 1;
        v4 = glMatrix.RANDOM() * 2 - 1;
        s2 = v3 * v3 + v4 * v4;
      } while (s2 >= 1);
  
      var d = Math.sqrt((1 - s1) / s2);
      out[0] = scale * v1;
      out[1] = scale * v2;
      out[2] = scale * v3 * d;
      out[3] = scale * v4 * d;
      return out;
    }*/
  /**
   * Transforms the {@link Vec4} with a {@link Mat4}.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - matrix to transform with
   * @returns `out`
   */
  static transformMat4(out, a, m) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
  /**
   * Transforms the {@link Vec4} with a {@link Quat}
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param q - quaternion to transform with
   * @returns `out`
   */
  static transformQuat(out, a, q) {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
  }
  /**
   * Set the components of a {@link Vec4} to zero
   * @category Static
   *
   * @param out - the receiving vector
   * @returns `out`
   */
  static zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
  }
  /**
   * Returns a string representation of a {@link Vec4}
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(a) {
    return `Vec4(${a.join(", ")})`;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const a3 = a[3];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    const b3 = b[3];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
  }
};
Vec4.prototype.sub = Vec4.prototype.subtract;
Vec4.prototype.mul = Vec4.prototype.multiply;
Vec4.prototype.div = Vec4.prototype.divide;
Vec4.prototype.dist = Vec4.prototype.distance;
Vec4.prototype.sqrDist = Vec4.prototype.squaredDistance;
Vec4.sub = Vec4.subtract;
Vec4.mul = Vec4.multiply;
Vec4.div = Vec4.divide;
Vec4.dist = Vec4.distance;
Vec4.sqrDist = Vec4.squaredDistance;
Vec4.sqrLen = Vec4.squaredLength;
Vec4.mag = Vec4.magnitude;
Vec4.length = Vec4.magnitude;
Vec4.len = Vec4.magnitude;

// node_modules/gl-matrix/dist/esm/quat.js
var Quat = class _Quat extends Float32Array {
  static {
    __name(this, "Quat");
  }
  /**
   * The number of bytes in a {@link Quat}.
   */
  static BYTE_LENGTH = 4 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Quat}.
   */
  constructor(...values) {
    switch (values.length) {
      case 4:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 4);
        break;
      case 1: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, v, v, v]);
        } else {
          super(v, 0, 4);
        }
        break;
      }
      default:
        super(4);
        this[3] = 1;
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the quaternion. Equivalent to `this[0];`
   * @category Quaternion components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the quaternion. Equivalent to `this[1];`
   * @category Quaternion components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  /**
   * The z component of the quaternion. Equivalent to `this[2];`
   * @category Quaternion components
   */
  get z() {
    return this[2];
  }
  set z(value) {
    this[2] = value;
  }
  /**
   * The w component of the quaternion. Equivalent to `this[3];`
   * @category Quaternion components
   */
  get w() {
    return this[3];
  }
  set w(value) {
    this[3] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Quat.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * Alias for {@link Quat.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Quat.str(this);`
   */
  get str() {
    return _Quat.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Quat} into `this`.
   *
   * @param a the source quaternion
   * @returns `this`
   */
  copy(a) {
    super.set(a);
    return this;
  }
  /**
   * Set `this` to the identity quaternion
   * Equivalent to Quat.identity(this)
   *
   * @returns `this`
   */
  identity() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    return this;
  }
  /**
   * Multiplies `this` by a {@link Quat}.
   * Equivalent to `Quat.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b) {
    return _Quat.multiply(this, this, b);
  }
  /**
   * Alias for {@link Quat.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Rotates `this` by the given angle about the X axis
   * Equivalent to `Quat.rotateX(this, this, rad);`
   *
   * @param rad - angle (in radians) to rotate
   * @returns `this`
   */
  rotateX(rad) {
    return _Quat.rotateX(this, this, rad);
  }
  /**
   * Rotates `this` by the given angle about the Y axis
   * Equivalent to `Quat.rotateY(this, this, rad);`
   *
   * @param rad - angle (in radians) to rotate
   * @returns `this`
   */
  rotateY(rad) {
    return _Quat.rotateY(this, this, rad);
  }
  /**
   * Rotates `this` by the given angle about the Z axis
   * Equivalent to `Quat.rotateZ(this, this, rad);`
   *
   * @param rad - angle (in radians) to rotate
   * @returns `this`
   */
  rotateZ(rad) {
    return _Quat.rotateZ(this, this, rad);
  }
  /**
   * Inverts `this`
   * Equivalent to `Quat.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return _Quat.invert(this, this);
  }
  /**
   * Scales `this` by a scalar number
   * Equivalent to `Quat.scale(this, this, scale);`
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `this`
   */
  scale(scale) {
    this[0] *= scale;
    this[1] *= scale;
    this[2] *= scale;
    this[3] *= scale;
    return this;
  }
  /**
   * Calculates the dot product of `this` and another {@link Quat}
   * Equivalent to `Quat.dot(this, b);`
   *
   * @param b - the second operand
   * @returns dot product of `this` and b
   */
  dot(b) {
    return _Quat.dot(this, b);
  }
  //===================
  // Static methods
  //===================
  /**
   * Creates a new identity quat
   * @category Static
   *
   * @returns a new quaternion
   */
  static create() {
    return new _Quat();
  }
  /**
   * Set a quat to the identity quaternion
   * @category Static
   *
   * @param out - the receiving quaternion
   * @returns `out`
   */
  static identity(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param axis - the axis around which to rotate
   * @param rad - the angle in radians
   * @returns `out`
   **/
  static setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    const s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @category Static
   *
   * @param out_axis - Vector receiving the axis of rotation
   * @param q - Quaternion to be decomposed
   * @return Angle, in radians, of the rotation
   */
  static getAxisAngle(out_axis, q) {
    const rad = Math.acos(q[3]) * 2;
    const s = Math.sin(rad / 2);
    if (s > EPSILON) {
      out_axis[0] = q[0] / s;
      out_axis[1] = q[1] / s;
      out_axis[2] = q[2] / s;
    } else {
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }
    return rad;
  }
  /**
   * Gets the angular distance between two unit quaternions
   * @category Static
   *
   * @param  {ReadonlyQuat} a     Origin unit quaternion
   * @param  {ReadonlyQuat} b     Destination unit quaternion
   * @return {Number}     Angle, in radians, between the two quaternions
   */
  static getAngle(a, b) {
    const dotproduct = _Quat.dot(a, b);
    return Math.acos(2 * dotproduct * dotproduct - 1);
  }
  /**
   * Multiplies two quat's
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the X axis
   * @category Static
   *
   * @param out - quat receiving operation result
   * @param a - quat to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateX(out, a, rad) {
    rad *= 0.5;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    const bx = Math.sin(rad);
    const bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the Y axis
   * @category Static
   *
   * @param out - quat receiving operation result
   * @param a - quat to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateY(out, a, rad) {
    rad *= 0.5;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    const by = Math.sin(rad);
    const bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the Z axis
   * @category Static
   *
   * @param out - quat receiving operation result
   * @param a - quat to rotate
   * @param rad - angle (in radians) to rotate
   * @returns `out`
   */
  static rotateZ(out, a, rad) {
    rad *= 0.5;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    const bz = Math.sin(rad);
    const bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate W component of
   * @returns `out`
   */
  static calculateW(out, a) {
    const x = a[0], y = a[1], z = a[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
    return out;
  }
  /**
   * Calculate the exponential of a unit quaternion.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate the exponential of
   * @returns `out`
   */
  static exp(out, a) {
    const x = a[0], y = a[1], z = a[2], w = a[3];
    const r = Math.sqrt(x * x + y * y + z * z);
    const et = Math.exp(w);
    const s = r > 0 ? et * Math.sin(r) / r : 0;
    out[0] = x * s;
    out[1] = y * s;
    out[2] = z * s;
    out[3] = et * Math.cos(r);
    return out;
  }
  /**
   * Calculate the natural logarithm of a unit quaternion.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate the exponential of
   * @returns `out`
   */
  static ln(out, a) {
    const x = a[0], y = a[1], z = a[2], w = a[3];
    const r = Math.sqrt(x * x + y * y + z * z);
    const t = r > 0 ? Math.atan2(r, w) / r : 0;
    out[0] = x * t;
    out[1] = y * t;
    out[2] = z * t;
    out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
    return out;
  }
  /**
   * Calculate the scalar power of a unit quaternion.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate the exponential of
   * @param b - amount to scale the quaternion by
   * @returns `out`
   */
  static pow(out, a, b) {
    _Quat.ln(out, a);
    _Quat.scale(out, out, b);
    _Quat.exp(out, out);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static slerp(out, a, b, t) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let scale0;
    let scale1;
    let cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON) {
      const omega = Math.acos(cosom);
      const sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  /**
   * Generates a random unit quaternion
   * @category Static
   *
   * @param out - the receiving quaternion
   * @returns `out`
   */
  /*static random(out: QuatLike): QuatLike {
      // Implementation of http://planning.cs.uiuc.edu/node198.html
      // TODO: Calling random 3 times is probably not the fastest solution
      let u1 = glMatrix.RANDOM();
      let u2 = glMatrix.RANDOM();
      let u3 = glMatrix.RANDOM();
  
      let sqrt1MinusU1 = Math.sqrt(1 - u1);
      let sqrtU1 = Math.sqrt(u1);
  
      out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
      out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
      out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
      out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
      return out;
    }*/
  /**
   * Calculates the inverse of a quat
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate inverse of
   * @returns `out`
   */
  static invert(out, a) {
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    const invDot = dot ? 1 / dot : 0;
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  /**
   * Calculates the conjugate of a quat
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quat to calculate conjugate of
   * @returns `out`
   */
  static conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param m - rotation matrix
   * @returns `out`
   */
  static fromMat3(out, m) {
    const fTrace = m[0] + m[4] + m[8];
    let fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      let i = 0;
      if (m[4] > m[0])
        i = 1;
      if (m[8] > m[i * 3 + i])
        i = 2;
      let j = (i + 1) % 3;
      let k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  /**
   * Creates a quaternion from the given euler angle x, y, z.
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param x - Angle to rotate around X axis in degrees.
   * @param y - Angle to rotate around Y axis in degrees.
   * @param z - Angle to rotate around Z axis in degrees.
   * @param {'xyz'|'xzy'|'yxz'|'yzx'|'zxy'|'zyx'} order - Intrinsic order for conversion, default is zyx.
   * @returns `out`
   */
  static fromEuler(out, x, y, z, order = ANGLE_ORDER) {
    let halfToRad = 0.5 * Math.PI / 180;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);
    switch (order) {
      case "xyz":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "xzy":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;
      case "yxz":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;
      case "yzx":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "zxy":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "zyx":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;
      default:
        throw new Error("Unknown angle order " + order);
    }
    return out;
  }
  /**
   * Returns a string representation of a quatenion
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(a) {
    return `Quat(${a.join(", ")})`;
  }
  /**
   * Creates a new quat initialized with values from an existing quaternion
   * @category Static
   *
   * @param a - quaternion to clone
   * @returns a new quaternion
   */
  static clone(a) {
    return new _Quat(a);
  }
  /**
   * Creates a new quat initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns a new quaternion
   */
  static fromValues(x, y, z, w) {
    return new _Quat(x, y, z, w);
  }
  /**
   * Copy the values from one quat to another
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the source quaternion
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Set the components of a {@link Quat} to the given values
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @param w - W component
   * @returns `out`
   */
  static set(out, x, y, z, w) {
    return out;
  }
  /**
   * Adds two {@link Quat}'s
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(out, a, b) {
    return out;
  }
  /**
   * Alias for {@link Quat.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return out;
  }
  /**
   * Scales a quat by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param b - amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a, scale) {
    out[0] = a[0] * scale;
    out[1] = a[1] * scale;
    out[2] = a[2] * scale;
    out[3] = a[3] * scale;
    return out;
  }
  /**
   * Calculates the dot product of two quat's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  /**
   * Performs a linear interpolation between two quat's
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a, b, t) {
    return out;
  }
  /**
   * Calculates the magnitude (length) of a {@link Quat}
   * @category Static
   *
   * @param a - quaternion to calculate length of
   * @returns length of `a`
   */
  static magnitude(a) {
    return 0;
  }
  /**
   * Alias for {@link Quat.magnitude}
   * @category Static
   */
  static mag(a) {
    return 0;
  }
  /**
   * Alias for {@link Quat.magnitude}
   * @category Static
   * @deprecated Use {@link Quat.magnitude} to avoid conflicts with builtin `length` methods/attribs
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(a) {
    return 0;
  }
  /**
   * Alias for {@link Quat.magnitude}
   * @category Static
   * @deprecated Use {@link Quat.mag}
   */
  static len(a) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Quat}
   * @category Static
   *
   * @param a - quaternion to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(a) {
    return 0;
  }
  /**
   * Alias for {@link Quat.squaredLength}
   * @category Static
   */
  static sqrLen(a) {
    return 0;
  }
  /**
   * Normalize a {@link Quat}
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - quaternion to normalize
   * @returns `out`
   */
  static normalize(out, a) {
    return out;
  }
  /**
   * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first quaternion.
   * @param b - The second quaternion.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(a, b) {
    return false;
  }
  /**
   * Returns whether or not the quaternions have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(a, b) {
    return false;
  }
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   * @category Static
   *
   * @param out - the receiving quaternion.
   * @param a - the initial vector
   * @param b - the destination vector
   * @returns `out`
   */
  static rotationTo(out, a, b) {
    let dot = Vec3.dot(a, b);
    if (dot < -0.999999) {
      Vec3.cross(tmpVec32, xUnitVec3, a);
      if (Vec3.mag(tmpVec32) < 1e-6)
        Vec3.cross(tmpVec32, yUnitVec3, a);
      Vec3.normalize(tmpVec32, tmpVec32);
      _Quat.setAxisAngle(out, tmpVec32, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      Vec3.cross(tmpVec32, a, b);
      out[0] = tmpVec32[0];
      out[1] = tmpVec32[1];
      out[2] = tmpVec32[2];
      out[3] = 1 + dot;
      return _Quat.normalize(out, out);
    }
  }
  /**
   * Performs a spherical linear interpolation with two control points
   * @category Static
   *
   * @param out - the receiving quaternion
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static sqlerp(out, a, b, c, d, t) {
    _Quat.slerp(tmpQuat1, a, d, t);
    _Quat.slerp(tmpQuat2, b, c, t);
    _Quat.slerp(out, tmpQuat1, tmpQuat2, 2 * t * (1 - t));
    return out;
  }
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   * @category Static
   *
   * @param out - The receiving quaternion
   * @param view - the vector representing the viewing direction
   * @param right - the vector representing the local "right" direction
   * @param up - the vector representing the local "up" direction
   * @returns `out`
   */
  static setAxes(out, view, right, up) {
    tmpMat3[0] = right[0];
    tmpMat3[3] = right[1];
    tmpMat3[6] = right[2];
    tmpMat3[1] = up[0];
    tmpMat3[4] = up[1];
    tmpMat3[7] = up[2];
    tmpMat3[2] = -view[0];
    tmpMat3[5] = -view[1];
    tmpMat3[8] = -view[2];
    return _Quat.normalize(out, _Quat.fromMat3(out, tmpMat3));
  }
};
var tmpQuat1 = new Float32Array(4);
var tmpQuat2 = new Float32Array(4);
var tmpMat3 = new Float32Array(9);
var tmpVec32 = new Float32Array(3);
var xUnitVec3 = new Float32Array([1, 0, 0]);
var yUnitVec3 = new Float32Array([0, 1, 0]);
Quat.set = Vec4.set;
Quat.add = Vec4.add;
Quat.lerp = Vec4.lerp;
Quat.normalize = Vec4.normalize;
Quat.squaredLength = Vec4.squaredLength;
Quat.sqrLen = Vec4.squaredLength;
Quat.exactEquals = Vec4.exactEquals;
Quat.equals = Vec4.equals;
Quat.magnitude = Vec4.magnitude;
Quat.prototype.mul = Quat.prototype.multiply;
Quat.mul = Quat.multiply;
Quat.mag = Quat.magnitude;
Quat.length = Quat.magnitude;
Quat.len = Quat.magnitude;

// node_modules/gl-matrix/dist/esm/vec2.js
var Vec2 = class _Vec2 extends Float32Array {
  static {
    __name(this, "Vec2");
  }
  /**
   * The number of bytes in a {@link Vec2}.
   */
  static BYTE_LENGTH = 2 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Vec2}.
   */
  constructor(...values) {
    switch (values.length) {
      case 2: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, values[1]]);
        } else {
          super(v, values[1], 2);
        }
        break;
      }
      case 1: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, v]);
        } else {
          super(v, 0, 2);
        }
        break;
      }
      default:
        super(2);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(value) {
    this[0] = value;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(value) {
    this[1] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec2.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * TypedArrays to mean the number of elements in the array.
   */
  get magnitude() {
    return Math.hypot(this[0], this[1]);
  }
  /**
   * Alias for {@link Vec2.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec2.squaredMagnitude(this);`
   */
  get squaredMagnitude() {
    const x = this[0];
    const y = this[1];
    return x * x + y * y;
  }
  /**
   * Alias for {@link Vec2.squaredMagnitude}
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec2.str(this);`
   */
  get str() {
    return _Vec2.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec2} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  // Instead of zero(), use a.fill(0) for instances;
  /**
   * Adds a {@link Vec2} to `this`.
   * Equivalent to `Vec2.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(b) {
    this[0] += b[0];
    this[1] += b[1];
    return this;
  }
  /**
   * Subtracts a {@link Vec2} from `this`.
   * Equivalent to `Vec2.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(b) {
    this[0] -= b[0];
    this[1] -= b[1];
    return this;
  }
  /**
   * Alias for {@link Vec2.subtract}
   */
  sub(b) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec2}.
   * Equivalent to `Vec2.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b) {
    this[0] *= b[0];
    this[1] *= b[1];
    return this;
  }
  /**
   * Alias for {@link Vec2.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec2}.
   * Equivalent to `Vec2.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns {Vec2} `this`
   */
  divide(b) {
    this[0] /= b[0];
    this[1] /= b[1];
    return this;
  }
  /**
   * Alias for {@link Vec2.divide}
   */
  div(b) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec2.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(b) {
    this[0] *= b;
    this[1] *= b;
    return this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec2.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(b, scale) {
    this[0] += b[0] * scale;
    this[1] += b[1] * scale;
    return this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec2} and `this`.
   * Equivalent to `Vec2.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(b) {
    return _Vec2.distance(this, b);
  }
  /**
   * Alias for {@link Vec2.distance}
   */
  dist(b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec2} and `this`.
   * Equivalent to `Vec2.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(b) {
    return _Vec2.squaredDistance(this, b);
  }
  /**
   * Alias for {@link Vec2.squaredDistance}
   */
  sqrDist(b) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec2.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    this[0] *= -1;
    this[1] *= -1;
    return this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec2.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    return this;
  }
  /**
   * Sets each component of `this` to it's absolute value.
   * Equivalent to `Vec2.abs(this, this);`
   *
   * @returns `this`
   */
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    return this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec2}.
   * Equivalent to `Vec2.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(b) {
    return this[0] * b[0] + this[1] * b[1];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec2.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return _Vec2.normalize(this, this);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, empty {@link Vec2}
   * @category Static
   *
   * @returns A new 2D vector
   */
  static create() {
    return new _Vec2();
  }
  /**
   * Creates a new {@link Vec2} initialized with values from an existing vector
   * @category Static
   *
   * @param a - Vector to clone
   * @returns A new 2D vector
   */
  static clone(a) {
    return new _Vec2(a);
  }
  /**
   * Creates a new {@link Vec2} initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @returns A new 2D vector
   */
  static fromValues(x, y) {
    return new _Vec2(x, y);
  }
  /**
   * Copy the values from one {@link Vec2} to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - The source vector
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }
  /**
   * Set the components of a {@link Vec2} to the given values
   * @category Static
   *
   * @param out - The receiving vector
   * @param x - X component
   * @param y - Y component
   * @returns `out`
   */
  static set(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
  }
  /**
   * Adds two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  }
  /**
   * Alias for {@link Vec2.subtract}
   * @category Static
   */
  static sub(out, a, b) {
    return [0, 0];
  }
  /**
   * Multiplies two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
  }
  /**
   * Alias for {@link Vec2.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return [0, 0];
  }
  /**
   * Divides two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  }
  /**
   * Alias for {@link Vec2.divide}
   * @category Static
   */
  static div(out, a, b) {
    return [0, 0];
  }
  /**
   * Math.ceil the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to ceil
   * @returns `out`
   */
  static ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
  }
  /**
   * Math.floor the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to floor
   * @returns `out`
   */
  static floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
  }
  /**
   * Returns the minimum of two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
  }
  /**
   * Returns the maximum of two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
  }
  /**
   * Math.round the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to round
   * @returns `out`
   */
  static round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
  }
  /**
   * Scales a {@link Vec2} by a scalar number
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The vector to scale
   * @param b - Amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
  }
  /**
   * Adds two Vec2's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @param scale - The amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns distance between `a` and `b`
   */
  static distance(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  /**
   * Alias for {@link Vec2.distance}
   * @category Static
   */
  static dist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns Squared distance between `a` and `b`
   */
  static squaredDistance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return x * x + y * y;
  }
  /**
   * Alias for {@link Vec2.distance}
   * @category Static
   */
  static sqrDist(a, b) {
    return 0;
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec2}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(a) {
    let x = a[0];
    let y = a[1];
    return Math.sqrt(x * x + y * y);
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   */
  static mag(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   * @deprecated Use {@link Vec2.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   * @deprecated Use {@link Vec2.mag}
   */
  static len(a) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Vec2}
   * @category Static
   *
   * @param a - Vector to calculate squared length of
   * @returns Squared length of a
   */
  static squaredLength(a) {
    const x = a[0];
    const y = a[1];
    return x * x + y * y;
  }
  /**
   * Alias for {@link Vec2.squaredLength}
   */
  static sqrLen(a, b) {
    return 0;
  }
  /**
   * Negates the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to negate
   * @returns `out`
   */
  static negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  }
  /**
   * Returns the inverse of the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to invert
   * @returns `out`
   */
  static inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    return out;
  }
  /**
   * Returns the absolute value of the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to compute the absolute values of
   * @returns `out`
   */
  static abs(out, a) {
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    return out;
  }
  /**
   * Normalize a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to normalize
   * @returns `out`
   */
  static normalize(out, a) {
    const x = a[0];
    const y = a[1];
    let len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    return out;
  }
  /**
   * Calculates the dot product of two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns Dot product of `a` and `b`
   */
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  /**
   * Computes the cross product of two {@link Vec2}s
   * Note that the cross product must by definition produce a 3D vector.
   * For this reason there is also not instance equivalent for this function.
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static cross(out, a, b) {
    const z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
  }
  /**
   * Performs a linear interpolation between two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @param t - Interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a, b, t) {
    const ax = a[0];
    const ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat2}
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat2(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat2d}
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat2d(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat3}
   * 3rd vector component is implicitly '1'
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat3(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat4}
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat4(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
  }
  /**
   * Rotate a 2D vector
   * @category Static
   *
   * @param out - The receiving {@link Vec2}
   * @param a - The {@link Vec2} point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotate(out, a, b, rad) {
    const p0 = a[0] - b[0];
    const p1 = a[1] - b[1];
    const sinC = Math.sin(rad);
    const cosC = Math.cos(rad);
    out[0] = p0 * cosC - p1 * sinC + b[0];
    out[1] = p0 * sinC + p1 * cosC + b[1];
    return out;
  }
  /**
   * Get the angle between two 2D vectors
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(a, b) {
    const x1 = a[0];
    const y1 = a[1];
    const x2 = b[0];
    const y2 = b[1];
    const mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);
    const cosine = mag && (x1 * x2 + y1 * y2) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  /**
   * Set the components of a {@link Vec2} to zero
   * @category Static
   *
   * @param out - The receiving vector
   * @returns `out`
   */
  static zero(out) {
    out[0] = 0;
    out[1] = 0;
    return out;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns `true` if the vectors components are ===, `false` otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns `true` if the vectors are approximately equal, `false` otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const b0 = b[0];
    const b1 = b[1];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - Vector to represent as a string
   * @returns String representation of the vector
   */
  static str(a) {
    return `Vec2(${a.join(", ")})`;
  }
};
Vec2.prototype.sub = Vec2.prototype.subtract;
Vec2.prototype.mul = Vec2.prototype.multiply;
Vec2.prototype.div = Vec2.prototype.divide;
Vec2.prototype.dist = Vec2.prototype.distance;
Vec2.prototype.sqrDist = Vec2.prototype.squaredDistance;
Vec2.sub = Vec2.subtract;
Vec2.mul = Vec2.multiply;
Vec2.div = Vec2.divide;
Vec2.dist = Vec2.distance;
Vec2.sqrDist = Vec2.squaredDistance;
Vec2.sqrLen = Vec2.squaredLength;
Vec2.mag = Vec2.magnitude;
Vec2.length = Vec2.magnitude;
Vec2.len = Vec2.magnitude;

// src/core/transform.ts
var DEFAULT_TRANSLATION = new Vec3();
var DEFAULT_ROTATION = new Quat(0, 0, 0, 1);
var DEFAULT_SCALE = new Vec3(1, 1, 1);
var Transform = class {
  static {
    __name(this, "Transform");
  }
  #matrix;
  #normalMatrix;
  #translation;
  #rotation;
  #scale;
  #matrixRev = -1;
  #normalMatrixRev = -1;
  #trsRev = -1;
  #revision = 0;
  #changeCallback;
  constructor(desc) {
    if (!desc) {
      this.#matrix = new Mat4();
      this.#matrixRev = 0;
    } else if (desc.matrix) {
      this.#matrix = new Mat4(desc?.matrix);
      this.#matrixRev = 0;
    } else {
      this.#translation = new Vec3(desc.translation ?? DEFAULT_TRANSLATION);
      this.#rotation = new Quat(desc.rotation ?? DEFAULT_ROTATION);
      this.#scale = new Vec3(desc.scale ?? DEFAULT_SCALE);
      this.#trsRev = 0;
    }
    this.#changeCallback = desc?.onChange;
  }
  // Incremented every time the transform changes to make it easier to track
  // when dependent values need to be updated.
  get revision() {
    return this.#revision;
  }
  #ensureMatrix() {
    if (this.#matrixRev != this.#revision) {
      if (!this.#matrix) {
        this.#matrix = new Mat4();
      }
      Mat4.fromRotationTranslationScale(this.#matrix, this.#rotation, this.#translation, this.#scale);
      this.#matrixRev = this.#revision;
    }
  }
  /** Using the matrix getter returns a read-only version of the Matrix (in TypeScript at least)
   * to prevent you from altering the contents because calling this getter does not mark the
   * transform as updated. Use updateMatrix to get back a modifiable matrix.
   */
  get matrix() {
    this.#ensureMatrix();
    return this.#matrix;
  }
  /** Calling this marks the transform as updated, whether or not you alter the value, so only call
   * the *Ref variants when you intend to change the value.
   */
  get matrixRef() {
    this.#ensureMatrix();
    this.#matrixRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#matrix;
  }
  set matrix(value) {
    if (!this.#matrix) {
      this.#matrix = new Mat4(value);
    } else {
      this.#matrix.set(value);
    }
    this.#matrixRev = ++this.#revision;
    this.#changeCallback?.();
  }
  // Gets the corresponding 3x3 normalMatrix for this transform.
  // Cannot be set directly. Never initialized unless requested.
  get normalMatrix() {
    if (this.#normalMatrixRev != this.#revision) {
      if (!this.#normalMatrix) {
        this.#normalMatrix = new Mat3();
      }
      Mat3.normalFromMat4(this.#normalMatrix, this.matrix);
      this.#normalMatrixRev = this.#revision;
    }
    return this.#normalMatrix;
  }
  get mirrored() {
    this.#ensureMatrix();
    return Mat4.determinant(this.#matrix) < 0;
  }
  #ensureDecomposed() {
    if (this.#trsRev != this.#revision) {
      if (!this.#translation) {
        this.#translation = new Vec3();
        this.#rotation = new Quat();
        this.#scale = new Vec3();
      }
      Mat4.decompose(this.#rotation, this.#translation, this.#scale, this.#matrix);
      this.#trsRev = this.#revision;
    }
  }
  get translation() {
    this.#ensureDecomposed();
    return this.#translation;
  }
  get translationRef() {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#translation;
  }
  set translation(value) {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    this.#translation.set(value);
  }
  get rotation() {
    this.#ensureDecomposed();
    return this.#rotation;
  }
  get rotationRef() {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#rotation;
  }
  set rotation(value) {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    this.#rotation.set(value);
  }
  get scale() {
    this.#ensureDecomposed();
    return this.#scale;
  }
  get scaleRef() {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    return this.#scale;
  }
  set scale(value) {
    this.#ensureDecomposed();
    this.#trsRev = ++this.#revision;
    this.#changeCallback?.();
    this.#scale.set(value);
  }
};

// src/core/node.ts
var IDENTITY_MATRIX = new Mat4();
var Node = class {
  static {
    __name(this, "Node");
  }
  #parent;
  #children;
  #isDirty = true;
  #transform;
  #worldTransform;
  constructor() {
  }
  attachChild(child) {
    const childNode = child;
    if (childNode.parent && childNode.parent != this) {
      childNode.parent.removeChild(child);
    }
    if (!this.#children) {
      this.#children = /* @__PURE__ */ new Set();
    }
    this.#children.add(child);
    childNode.#parent = this;
    this.onChildAttached(child);
    childNode.#markDirty();
  }
  removeChild(child) {
    const childNode = child;
    const removed = this.#children?.delete(child);
    if (removed) {
      childNode.#parent = void 0;
      this.onChildRemoved(child);
      childNode.#markDirty();
    }
  }
  clearChildren() {
    if (!this.#children) {
      return;
    }
    for (const child of this.#children) {
      child.#parent = void 0;
      this.onChildRemoved(child);
      child.#markDirty();
    }
    this.#children.clear();
  }
  get children() {
    return this.#children?.values() ?? [];
  }
  get parent() {
    return this.#parent;
  }
  get transform() {
    if (!this.#transform) {
      this.#transform = new Transform({
        matrix: IDENTITY_MATRIX,
        onChange: /* @__PURE__ */ __name(() => this.#markDirty(), "onChange")
      });
    }
    return this.#transform;
  }
  set transform(value) {
    if (!this.#transform) {
      this.#transform = new Transform({
        matrix: value.matrix,
        onChange: /* @__PURE__ */ __name(() => this.#markDirty(), "onChange")
      });
    } else {
      this.#transform.matrix = value.matrix;
    }
  }
  get worldTransform() {
    if (this.#isDirty) {
      if (!this.#worldTransform) {
        this.#worldTransform = new Transform();
      }
      const localMatrix = this.#transform?.matrix ?? IDENTITY_MATRIX;
      if (!this.parent) {
        this.#worldTransform.matrix = localMatrix;
      } else {
        Mat4.mul(this.#worldTransform.matrixRef, this.parent.worldTransform.matrix, localMatrix);
      }
      this.#isDirty = false;
    }
    return this.#worldTransform;
  }
  #markDirty() {
    if (this.#isDirty) {
      return;
    }
    this.#isDirty = true;
    this.onUpdated();
    if (this.#children) {
      for (const child of this.#children) {
        child.#markDirty();
      }
    }
  }
  onUpdated() {
  }
  onChildAttached(child) {
  }
  onChildRemoved(child) {
  }
};

// src/core/actor.ts
var tags = /* @__PURE__ */ new Map();
function Tag(name) {
  let tagInstance = tags.get(name);
  if (!tagInstance) {
    const className = `Tag__${name}__`;
    const tagClass = { [className]: class {
      static SharedComponent = true;
      isTag = true;
      name = name;
    } }[className];
    tagClass.constructor = tagClass;
    tagInstance = tagClass;
    tags.set(name, tagInstance);
  }
  return tagInstance;
}
__name(Tag, "Tag");
var Actor = class _Actor extends Node {
  static {
    __name(this, "Actor");
  }
  #components;
  #stageData;
  label;
  // Just for debugging
  constructor(...components) {
    super();
    if (components) {
      this.add(...components);
    }
  }
  /**
   * Note: While a Actor may only have one of any given type of component, the components may
   * be shared between Actors without issue. ie: A single Mesh can be add to multiple actors,
   * which will result in multiple instances of the mesh being rendered.
   */
  add(...components) {
    if (!this.#components) {
      this.#components = /* @__PURE__ */ new Map();
    }
    for (const component of components) {
      if (component instanceof _Actor) {
        console.warn("Added an Actor as a component with add(). This is unusual. If you are attempting to attach a child to the Actor, use attachChild().");
      }
      const prev = this.#components.get(component.constructor);
      this.#components.set(component.constructor, component);
      prev?.removedFromActor?.(this);
      this.#stageData?.addActorComponent(this, component);
      component.addToActor?.(this);
      if (this.#stageData) {
        component.addToStage?.(this.#stageData?.stage, this);
      }
    }
    return this;
  }
  remove(componentType) {
    const component = this.#components?.get(componentType);
    if (!component) {
      return void 0;
    }
    this.#components.delete(componentType);
    if (this.#stageData) {
      component.removeFromStage?.(this.#stageData?.stage, this);
    }
    component?.removeFromActor?.(this);
    this.#stageData?.removeActorComponent(this, component.constructor);
    return component;
  }
  setStage(stageData) {
    if (this.#stageData && this.#components) {
      for (const component of this.#components.values()) {
        component.removeFromStage?.(this.#stageData.stage, this);
      }
    }
    this.#stageData = stageData;
    if (this.#stageData && this.#components) {
      for (const component of this.#components?.values()) {
        component.addToStage?.(this.#stageData.stage, this);
      }
    }
  }
  get stage() {
    return this.#stageData?.stage;
  }
  has(componentType) {
    return this.#components?.has(componentType) ?? false;
  }
  get(componentType) {
    return this.#components?.get(componentType);
  }
  get componentTypes() {
    return this.#components?.keys();
  }
  get components() {
    return this.#components?.values();
  }
  clone() {
    const newActor = new _Actor();
    newActor.transform.matrix = this.transform.matrix;
    for (const component of this.#components?.values() ?? []) {
      newActor.add(component.clone?.() ?? component);
    }
    for (const child of this.children) {
      newActor.attachChild(child.clone());
    }
    return newActor;
  }
  // Node overrides
  onChildAttached(child) {
    this.#stageData?.addActor(child, true);
  }
  onChildRemoved(child) {
    this.#stageData?.removeActor(child, true);
  }
};

// src/core/stage.ts
var IDENTITY_TRANSFORM = new Transform();
var Stage = class extends Actor {
  static {
    __name(this, "Stage");
  }
  #stageData = new StageData(this);
  #tickData = { tickId: 0, timestamp: 0, delta: 0, stage: this };
  #lastTimestamp = 0;
  static getComponentName(component) {
    return component.name ?? component.ComponentName ?? component.constructor.name;
  }
  static getComponentType(component) {
    return component.constructor;
  }
  constructor() {
    super();
    this.#stageData.addActor(this, false);
  }
  // TODO: Prevent Stage from being attached to another stage/actor
  // Node overrides
  get transform() {
    console.warn("Updating a Stage transform has no effect.");
    return super.transform;
  }
  get worldTransform() {
    return IDENTITY_TRANSFORM;
  }
  // Walks the entire scene graph, calling the given callback for every actor.
  // If the callback returns false the walk is canceled.
  walkActors(callback, ...args) {
    this.#walkActorList(this.children, callback, args);
  }
  #walkActorList(actors, callback, args) {
    for (const actor of actors) {
      callback(actor, args);
      this.#walkActorList(actor.children, callback, args);
    }
  }
  query(...componentTypes) {
    return this.#stageData.getQuery(componentTypes);
  }
  get tickData() {
    return this.#tickData;
  }
  tick(timestamp) {
    if (!timestamp) {
      timestamp = performance.now();
    }
    this.#tickData = {
      tickId: this.#stageData.nextTick++,
      timestamp,
      delta: this.#lastTimestamp > 0 ? timestamp - this.#lastTimestamp : 1,
      stage: this
    };
    this.#lastTimestamp = timestamp;
    for (const tickType of this.#stageData.tickTypes) {
      const componentSet = this.#stageData.components.get(tickType.componentType);
      if (componentSet) {
        for (const actor of componentSet.actors) {
          const component = actor.get(tickType.componentType);
          component.onTick(this.#tickData, actor);
        }
      }
    }
  }
};
var StageData = class {
  constructor(stage) {
    this.stage = stage;
  }
  stage;
  static {
    __name(this, "StageData");
  }
  actors = /* @__PURE__ */ new Set();
  components = /* @__PURE__ */ new Map();
  unsharedComponentActors = /* @__PURE__ */ new Map();
  tickTypes = [];
  queries = /* @__PURE__ */ new Map();
  nextTick = 1;
  groupTick = /* @__PURE__ */ new Map();
  #onNewCompontentType(componentType) {
    if ("onTick" in componentType.prototype) {
      this.tickTypes.push({
        order: componentType.TickOrder ?? 0,
        componentType
      });
      this.tickTypes = this.tickTypes.sort((a, b) => a.order - b.order);
    }
  }
  addActorComponent(actor, component) {
    const componentType = component.constructor;
    let componentSet = this.components.get(componentType);
    if (!componentSet) {
      componentSet = { actors: /* @__PURE__ */ new Set(), queries: [] };
      this.components.set(componentType, componentSet);
      this.#onNewCompontentType(componentType);
    }
    if (componentType.SharedComponent !== true) {
      const oldActor = this.unsharedComponentActors.get(component);
      if (oldActor && oldActor != actor) {
        oldActor.remove(componentType);
      }
      this.unsharedComponentActors.set(component, actor);
    }
    componentSet.actors.add(actor);
    for (const query of componentSet.queries) {
      query.clearCache();
    }
  }
  removeActorComponent(actor, componentType) {
    let componentSet = this.components.get(componentType);
    if (componentSet?.actors?.delete(actor)) {
      for (const query of componentSet.queries) {
        query.clearCache();
      }
    }
  }
  addActor(actor, recursive = true) {
    this.actors.add(actor);
    actor.setStage(this);
    for (const component of actor.components ?? []) {
      this.addActorComponent(actor, component);
    }
    if (recursive) {
      for (const child of actor.children) {
        this.addActor(child, true);
      }
    }
  }
  removeActor(actor, recursive = true) {
    this.actors.delete(actor);
    actor.setStage(void 0);
    for (const component of actor.componentTypes ?? []) {
      this.removeActorComponent(actor, component);
    }
    if (recursive) {
      for (const child of actor.children) {
        this.removeActor(child, true);
      }
    }
  }
  getQuery(componentTypes) {
    let componentNames = [];
    for (const type of componentTypes) {
      componentNames.push(Stage.getComponentName(type));
    }
    const queryName = componentNames.join(":");
    const cachedQuery = this.queries.get(queryName);
    if (cachedQuery !== void 0) {
      return cachedQuery;
    }
    return new StageQuery(this, queryName, componentTypes);
  }
  watchComponents(query, componentTypes) {
    for (const componentType of componentTypes) {
      let componentSet = this.components.get(componentType);
      if (componentSet === void 0) {
        componentSet = {
          actors: /* @__PURE__ */ new Set(),
          queries: []
        };
        this.components.set(componentType, componentSet);
      }
      componentSet.queries.push(query);
    }
  }
  // Clear the stage of all actors
  clear() {
    this.actors.clear();
    this.components.clear();
    for (const query of this.queries.values()) {
      query.clearCache();
    }
  }
};
var StageQuery = class _StageQuery {
  static {
    __name(this, "StageQuery");
  }
  name;
  include;
  exclude;
  #stageData;
  #queryWatching = false;
  #includedCache;
  constructor(stageData, queryName, includedTypes, excludedTypes = []) {
    this.#stageData = stageData;
    this.name = queryName;
    this.#stageData.queries.set(queryName, this);
    this.include = includedTypes;
    this.exclude = excludedTypes;
    for (const type of excludedTypes) {
      if (includedTypes.includes(type)) {
        throw new Error(`Component type "${Stage.getComponentName(type)}" cannot be both included and excluded in the same query.`);
      }
    }
  }
  not(...componentTypes) {
    let componentNames = [];
    for (const type of componentTypes) {
      componentNames.push(Stage.getComponentName(type));
    }
    const queryName = this.name + "!" + componentNames.join(":!");
    const cachedQuery = this.#stageData.queries.get(queryName);
    if (cachedQuery !== void 0) {
      return cachedQuery;
    }
    return new _StageQuery(this.#stageData, queryName, this.include, this.exclude.concat(componentTypes));
  }
  clearCache() {
    this.#includedCache = void 0;
  }
  #getIncludedActors() {
    if (!this.#includedCache) {
      if (!this.#queryWatching) {
        this.#stageData.watchComponents(this, this.include);
        this.#queryWatching = true;
      }
      let queryActors = /* @__PURE__ */ new Set();
      for (let i = 0; i < this.include.length; ++i) {
        const componentType = this.include[i];
        const componentSet = this.#stageData.components.get(componentType);
        const componentActors = componentSet?.actors;
        if (!componentActors) {
          queryActors.clear();
          break;
        }
        if (i == 0) {
          queryActors = componentActors;
        } else {
          queryActors = queryActors.intersection(componentActors);
        }
        if (queryActors.size === 0) {
          break;
        }
      }
      this.#includedCache = queryActors;
    }
    return this.#includedCache;
  }
  forEach(callback) {
    const args = new Array(this.include.length);
    const queryActors = this.#getIncludedActors();
    if (queryActors.size === 0) {
      return;
    }
    for (const actor of queryActors) {
      let excluded = false;
      for (const componentId of this.exclude) {
        if (actor.has(componentId)) {
          excluded = true;
          break;
        }
      }
      if (excluded) {
        continue;
      }
      for (let i = 0; i < this.include.length; ++i) {
        args[i] = actor.get(this.include[i]);
      }
      const keepIterating = callback(actor, ...args);
      if (keepIterating === false) {
        return;
      }
    }
  }
  // Just gets the count of how many objects this query would return. Generally don't call this
  // unless the ONLY thing you care about is how many of something there are in the world. If you
  // actually want to do anything with the objects queried just call forEach and increment a
  // counter for each object.
  getCount() {
    const queryActors = this.#getIncludedActors();
    let count = 0;
    for (const actor of queryActors) {
      let excluded = false;
      for (const componentId of this.exclude) {
        if (actor.has(componentId)) {
          excluded = true;
          break;
        }
      }
      if (excluded) {
        continue;
      }
      count++;
    }
    return count;
  }
};

// src/util/config.ts
var UPDATED_CONFIGS = /* @__PURE__ */ new Set();
var CONFIG_UPDATE_INTERVAL = 10 * 1e3;
var CONFIG_HANDLER = {
  set(obj, key, value) {
    const changed = obj[key] !== value;
    const ret = Reflect.set(...arguments);
    if (changed) {
      obj.fireChangedEvent(key, value);
    }
    return ret;
  },
  get: /* @__PURE__ */ __name(function(obj, key) {
    const result = Reflect.get(obj, key);
    if (typeof result === "function")
      return result.bind(obj);
    return result;
  }, "get")
};
var configStringify = /* @__PURE__ */ __name((key, value) => {
  return value instanceof Object && !(value instanceof Array) ? Object.keys(value).reduce((out, key2) => {
    if (key2 != "configRevision") {
      out[key2] = value[key2];
    }
    return out;
  }, {}) : value;
}, "configStringify");
function SaveAllConfigs() {
  if (UPDATED_CONFIGS.size) {
    for (const config of UPDATED_CONFIGS) {
      config.saveToStorage();
    }
    UPDATED_CONFIGS.clear();
  }
}
__name(SaveAllConfigs, "SaveAllConfigs");
function isMobileBrowser() {
  if ("mobile" in navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }
  let check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
__name(isMobileBrowser, "isMobileBrowser");
var CONFIG_DEFAULTS = /* @__PURE__ */ new Map();
var updateInterval;
var Config = class extends EventTarget {
  static {
    __name(this, "Config");
  }
  #loading = false;
  #nextRevision = 1;
  #revision = this.#nextRevision++;
  #configRevisions = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  static Create(configType, args = null) {
    const config = new configType();
    config.#loading = true;
    let defaults = CONFIG_DEFAULTS.get(config.configStorageName);
    if (!defaults) {
      defaults = new configType();
      if (Object.hasOwn(config.constructor, "SetDefaults")) {
        const deviceDefaults = config.constructor.SetDefaults(isMobileBrowser(), args);
        defaults.#setConfigProperties(deviceDefaults);
      }
      CONFIG_DEFAULTS.set(config.configStorageName, defaults);
    }
    config.#setConfigProperties(defaults);
    if (config.configStorageName) {
      config.loadFromStorage();
      config.updateFromQueryArgs();
    }
    if (!updateInterval) {
      updateInterval = setInterval(SaveAllConfigs, CONFIG_UPDATE_INTERVAL);
    }
    config.#loading = false;
    return new Proxy(config, CONFIG_HANDLER);
  }
  get configStorageName() {
    return this.constructor.name;
  }
  fireChangedEvent(property, value) {
    if (this.#loading) {
      return;
    }
    this.#updateRevision();
    if (this.configStorageName) {
      UPDATED_CONFIGS.add(this);
    }
    let event = new CustomEvent("changed", {
      cancelable: false,
      bubbles: true,
      detail: {
        property,
        value
      }
    });
    this.dispatchEvent(event);
  }
  #updateRevision() {
    const key = JSON.stringify(this, configStringify);
    const cachedRevision = this.#configRevisions.get(key);
    if (cachedRevision) {
      this.#revision = cachedRevision;
    } else {
      this.#revision = this.#nextRevision++;
      this.#configRevisions.set(key, this.#revision);
    }
  }
  get configRevision() {
    return this.#revision;
  }
  #getConfigProperties() {
    let defaults = CONFIG_DEFAULTS.get(this.configStorageName);
    return Object.keys(defaults).reduce((out, key) => {
      if (!defaults || defaults[key] !== this[key]) {
        out[key] = this[key];
      }
      return out;
    }, {});
  }
  #setConfigProperties(obj) {
    if (!obj) {
      return;
    }
    for (const key of Object.keys(obj)) {
      if (Object.hasOwn(this, key)) {
        if (this[key] == key) {
          continue;
        }
        this[key] = obj[key];
        this.fireChangedEvent(key, obj[key]);
      } else {
        console.warn(`Attempting to set unknown config property: ${key}.`);
      }
    }
  }
  saveToStorage() {
    let storageName = this.configStorageName;
    if (!storageName) {
      throw new Error("Config does not specify a storage name");
    }
    console.info(`Saving updates to Config: ${storageName}, revision ${this.configRevision}`);
    localStorage.setItem(storageName, JSON.stringify(this.#getConfigProperties()));
  }
  loadFromStorage() {
    let storageName = this.configStorageName;
    if (!storageName) {
      throw new Error("Config does not specify a storage name");
    }
    let json = localStorage.getItem(storageName);
    if (!json) {
      return;
    }
    let obj;
    try {
      obj = JSON.parse(json);
    } catch (err) {
      console.warn(`Config loaded from localStorage was not valid json. ${err.message}`);
      return;
    }
    this.#setConfigProperties(obj);
  }
  async loadFromUrl(url) {
    const response = await fetch(url);
    let obj;
    try {
      obj = await response.json();
    } catch (err) {
      console.warn(`Config loaded from ${url} was not valid json. ${err.message}`);
      return;
    }
    this.#setConfigProperties(obj);
  }
  // Updates the config to use values given in the URL query args if they match
  updateFromQueryArgs() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      if (Object.hasOwn(this, key)) {
        let parsedValue = void 0;
        if (typeof this[key] === "string") {
          parsedValue = value;
        } else if (typeof this[key] === "number") {
          parsedValue = parseFloat(value);
        } else if (typeof this[key] === "boolean") {
          parsedValue = parseInt(value, 10) != 0;
        }
        if (parsedValue !== void 0 && this[key] != parsedValue) {
          this[key] = parsedValue;
          this.fireChangedEvent(key, parsedValue);
        }
      }
    });
  }
  resetToDefaults() {
    let storageName = this.configStorageName;
    if (!storageName) {
      throw new Error("Config does not specify a storage name");
    }
    this.#setConfigProperties(CONFIG_DEFAULTS.get(storageName));
  }
  watch(...properties) {
    return new ConfigWatcher(this, ...properties);
  }
};
var ConfigWatcher = class extends Config {
  static {
    __name(this, "ConfigWatcher");
  }
  constructor(config, ...properties) {
    super();
    if (config) {
      this.addWatch(config, ...properties);
    }
  }
  get configStorageName() {
    return null;
  }
  addWatch(config, ...properties) {
    for (const property of properties) {
      if (Object.hasOwn(this, property)) {
        throw new Error(`ConfigWatcher is already watching a property named ${property}`);
      }
      this[property] = config[property];
    }
    config.addEventListener("changed", (event) => {
      const detail = event.detail;
      if (Object.hasOwn(this, detail.property)) {
        this[detail.property] = detail.value;
        this.fireChangedEvent(detail.property, detail.value);
      }
    });
  }
};

// src/renderer/render-config.ts
var RenderConfig = class _RenderConfig extends Config {
  static {
    __name(this, "RenderConfig");
  }
  colorFormat = navigator.gpu?.getPreferredCanvasFormat() ?? "bgra8unorm";
  depthStencilFormat = "depth24plus";
  selectionFormat = "r32uint";
  sampleCount = 1;
  // How large the render targets are compared to the screen resolution.
  // (Canvas render target size will always be 1:1 to allow for better UI)
  outputScale = 1;
  emojiTextureSize = 512;
  static SetDefaults(isMobile, device) {
    const defaults = isMobile ? new MobileRenderConfig() : new _RenderConfig();
    return defaults;
  }
};
var MobileRenderConfig = class extends RenderConfig {
  static {
    __name(this, "MobileRenderConfig");
  }
  depthStencilFormat = "depth16unorm";
  sampleCount = 1;
  outputScale = 0.6;
  emojiTextureSize = 256;
};

// src/util/buffer-to-hex.ts
var uint8ToHex;
function GetUint8ToHex() {
  if (!uint8ToHex) {
    uint8ToHex = new Array(256);
    for (let i = 0; i <= 255; ++i) {
      uint8ToHex[i] = i.toString(16).padStart(2, "0");
    }
  }
  return uint8ToHex;
}
__name(GetUint8ToHex, "GetUint8ToHex");
var hexToUint8;
function GetHexToUint8() {
  if (!hexToUint8) {
    hexToUint8 = /* @__PURE__ */ new Map();
    for (let i = 0; i <= 255; ++i) {
      hexToUint8.set(i.toString(16).padStart(2, "0"), i);
    }
  }
  return hexToUint8;
}
__name(GetHexToUint8, "GetHexToUint8");
function BufferToHexString(buffer) {
  const lut = GetUint8ToHex();
  const array = new Uint8Array(buffer);
  let outStr = "";
  for (let i = 0; i < array.length; ++i) {
    outStr += lut[array[i]];
  }
  return outStr;
}
__name(BufferToHexString, "BufferToHexString");
function HexStringToBuffer(value) {
  const lut = GetHexToUint8();
  const array = new Uint8Array(value.length / 2);
  for (let i = 0; i < array.length; ++i) {
    const strOffset = i * 2;
    array[i] = lut.get(value.substring(strOffset, strOffset + 2));
  }
  return array.buffer;
}
__name(HexStringToBuffer, "HexStringToBuffer");

// src/renderer/attachment-layout.ts
var RenderableFormatValue = /* @__PURE__ */ ((RenderableFormatValue2) => {
  RenderableFormatValue2[RenderableFormatValue2["r8unorm"] = 1] = "r8unorm";
  RenderableFormatValue2[RenderableFormatValue2["r8uint"] = 2] = "r8uint";
  RenderableFormatValue2[RenderableFormatValue2["r8sint"] = 3] = "r8sint";
  RenderableFormatValue2[RenderableFormatValue2["rg8unorm"] = 4] = "rg8unorm";
  RenderableFormatValue2[RenderableFormatValue2["rg8uint"] = 5] = "rg8uint";
  RenderableFormatValue2[RenderableFormatValue2["rg8sint"] = 6] = "rg8sint";
  RenderableFormatValue2[RenderableFormatValue2["rgba8unorm"] = 7] = "rgba8unorm";
  RenderableFormatValue2[RenderableFormatValue2["rgba8unorm-srgb"] = 8] = "rgba8unorm-srgb";
  RenderableFormatValue2[RenderableFormatValue2["rgba8uint"] = 9] = "rgba8uint";
  RenderableFormatValue2[RenderableFormatValue2["rgba8sint"] = 10] = "rgba8sint";
  RenderableFormatValue2[RenderableFormatValue2["bgra8unorm"] = 11] = "bgra8unorm";
  RenderableFormatValue2[RenderableFormatValue2["bgra8unorm-srgb"] = 12] = "bgra8unorm-srgb";
  RenderableFormatValue2[RenderableFormatValue2["r16uint"] = 13] = "r16uint";
  RenderableFormatValue2[RenderableFormatValue2["r16sint"] = 14] = "r16sint";
  RenderableFormatValue2[RenderableFormatValue2["r16float"] = 15] = "r16float";
  RenderableFormatValue2[RenderableFormatValue2["rg16uint"] = 16] = "rg16uint";
  RenderableFormatValue2[RenderableFormatValue2["rg16sint"] = 17] = "rg16sint";
  RenderableFormatValue2[RenderableFormatValue2["rg16float"] = 18] = "rg16float";
  RenderableFormatValue2[RenderableFormatValue2["rgba16uint"] = 19] = "rgba16uint";
  RenderableFormatValue2[RenderableFormatValue2["rgba16sint"] = 20] = "rgba16sint";
  RenderableFormatValue2[RenderableFormatValue2["rgba16float"] = 21] = "rgba16float";
  RenderableFormatValue2[RenderableFormatValue2["r32uint"] = 22] = "r32uint";
  RenderableFormatValue2[RenderableFormatValue2["r32sint"] = 23] = "r32sint";
  RenderableFormatValue2[RenderableFormatValue2["r32float"] = 24] = "r32float";
  RenderableFormatValue2[RenderableFormatValue2["rg32uint"] = 25] = "rg32uint";
  RenderableFormatValue2[RenderableFormatValue2["rg32sint"] = 26] = "rg32sint";
  RenderableFormatValue2[RenderableFormatValue2["rg32float"] = 27] = "rg32float";
  RenderableFormatValue2[RenderableFormatValue2["rgba32uint"] = 28] = "rgba32uint";
  RenderableFormatValue2[RenderableFormatValue2["rgba32sint"] = 29] = "rgba32sint";
  RenderableFormatValue2[RenderableFormatValue2["rgba32float"] = 30] = "rgba32float";
  RenderableFormatValue2[RenderableFormatValue2["rgb10a2uint"] = 31] = "rgb10a2uint";
  RenderableFormatValue2[RenderableFormatValue2["rgb10a2unorm"] = 32] = "rgb10a2unorm";
  RenderableFormatValue2[RenderableFormatValue2["rg11b10ufloat"] = 33] = "rg11b10ufloat";
  return RenderableFormatValue2;
})(RenderableFormatValue || {});
var DepthStencilFormatValue = /* @__PURE__ */ ((DepthStencilFormatValue2) => {
  DepthStencilFormatValue2[DepthStencilFormatValue2["stencil8"] = 1] = "stencil8";
  DepthStencilFormatValue2[DepthStencilFormatValue2["depth16unorm"] = 2] = "depth16unorm";
  DepthStencilFormatValue2[DepthStencilFormatValue2["depth24plus"] = 3] = "depth24plus";
  DepthStencilFormatValue2[DepthStencilFormatValue2["depth24plus-stencil8"] = 4] = "depth24plus-stencil8";
  DepthStencilFormatValue2[DepthStencilFormatValue2["depth32float"] = 5] = "depth32float";
  DepthStencilFormatValue2[DepthStencilFormatValue2["depth32float-stencil8"] = 6] = "depth32float-stencil8";
  return DepthStencilFormatValue2;
})(DepthStencilFormatValue || {});
var AttachmentLayout = class _AttachmentLayout {
  static {
    __name(this, "AttachmentLayout");
  }
  // Caching
  static #nextId = 1;
  static #keyMap = /* @__PURE__ */ new Map();
  // Map of the given key to an ID
  static #cache = /* @__PURE__ */ new Map();
  // Map of ID to cached resource
  static GetById(id) {
    return this.#cache.get(id);
  }
  static #AddToCache(layout, key) {
    Object.freeze(layout);
    this.#keyMap.set(key, layout.id);
    this.#cache.set(layout.id, layout);
    return layout;
  }
  static Deserialize(value) {
    const id = this.#keyMap.get(value);
    if (id !== void 0) {
      return this.#cache.get(id);
    }
    const buffer = HexStringToBuffer(value);
    const layout = _AttachmentLayout.#DeserializeFromBuffer(buffer);
    layout.#serializedBuffer = buffer;
    layout.#serializedString = value;
    return this.#AddToCache(layout, value);
  }
  static #DeserializeFromBuffer(inBuffer, bufferOffest, bufferLength) {
    const dataView = new DataView(inBuffer, bufferOffest, bufferLength);
    const sampleCount = dataView.getUint8(0);
    const depthStencilFormat = DepthStencilFormatValue[dataView.getUint8(1)];
    const colorFormatCount = dataView.getUint8(2);
    const colorFormats = [];
    for (let i = 0; i < colorFormatCount; ++i) {
      colorFormats.push(RenderableFormatValue[dataView.getUint8(3 + i)]);
    }
    return new _AttachmentLayout(colorFormats, depthStencilFormat, sampleCount);
  }
  static DefaultOutputType(format) {
    switch (format) {
      case "r8unorm":
      case "rg8unorm":
      case "rgba8unorm":
      case "rgba8unorm-srgb":
      case "bgra8unorm":
      case "bgra8unorm-srgb":
      case "r16float":
      case "rg16float":
      case "rgba16float":
      case "r32float":
      case "rg32float":
      case "rgba32float":
      case "rgb10a2unorm":
      case "rg11b10ufloat":
        return "vec4f";
      case "r8uint":
      case "rg8uint":
      case "rgba8uint":
      case "r16uint":
      case "rg16uint":
      case "rgba16uint":
      case "r32uint":
      case "rg32uint":
      case "rgba32uint":
      case "rgb10a2uint":
        return "vec4u";
      case "r8sint":
      case "rg8sint":
      case "rgba8sint":
      case "r16sint":
      case "rg16sint":
      case "rgba16sint":
      case "r32sint":
      case "rg32sint":
      case "rgba32sint":
        return "vec4i";
      default:
        throw new Error(`Unsupported Renderable Format ${format}`);
    }
  }
  // Layout
  id;
  colorFormats;
  depthStencilFormat;
  sampleCount;
  #serializedBuffer;
  #serializedString;
  constructor(colorFormats, depthStencilFormat, sampleCount = 1) {
    const formats = [];
    if (Array.isArray(colorFormats)) {
      for (const format of colorFormats) {
        if (RenderableFormatValue[format] == void 0) {
          throw new Error(`${format} is not a renderable format`);
        }
        formats.push(format);
      }
    } else {
      if (RenderableFormatValue[colorFormats] == void 0) {
        throw new Error(`${colorFormats} is not a renderable format`);
      }
      formats.push(colorFormats);
    }
    if (depthStencilFormat && DepthStencilFormatValue[depthStencilFormat] == void 0) {
      throw new Error(`${depthStencilFormat} is not a depth/stencil format`);
    }
    this.id = 0;
    this.colorFormats = formats;
    this.depthStencilFormat = depthStencilFormat;
    this.sampleCount = sampleCount;
    const key = this.serializeToString();
    const id = _AttachmentLayout.#keyMap.get(key);
    if (id !== void 0) {
      return _AttachmentLayout.#cache.get(id);
    }
    this.id = _AttachmentLayout.#nextId++;
    _AttachmentLayout.#AddToCache(this, key);
  }
  // The AttachmentLayout's binary serialized format is:
  //  - Byte 0: Sample Count
  //  - Byte 1: DepthStencilFormat
  //  - Byte 3: Color Format Count (N)
  //  - Byte 4-N: RenderableFormat
  serializeToBuffer() {
    if (this.#serializedBuffer) {
      return this.#serializedBuffer;
    }
    const byteLength = 3 + this.colorFormats.length;
    const outBuffer = new ArrayBuffer(byteLength);
    const dataView = new DataView(outBuffer);
    dataView.setUint8(0, this.sampleCount);
    dataView.setUint8(1, this.depthStencilFormat ? DepthStencilFormatValue[this.depthStencilFormat] : 0);
    dataView.setUint8(2, this.colorFormats.length);
    for (let i = 0; i < this.colorFormats.length; ++i) {
      dataView.setUint8(i + 3, RenderableFormatValue[this.colorFormats[i]]);
    }
    this.#serializedBuffer = outBuffer;
    return outBuffer;
  }
  // The string format is the same as the binary format, written in hex pairs.
  serializeToString() {
    if (!this.#serializedString) {
      this.#serializedString = BufferToHexString(this.serializeToBuffer());
    }
    return this.#serializedString;
  }
};

// src/materials/material-base.ts
var ActorMaterial = class {
  static {
    __name(this, "ActorMaterial");
  }
  material;
  materialType;
  constructor(material) {
    this.materialType = Stage.getComponentType(material);
    this.material = material;
  }
};
var MaterialBase = class {
  static {
    __name(this, "MaterialBase");
  }
  addToActor(actor) {
    let actorMaterial = actor.get(ActorMaterial);
    if (actorMaterial) {
      actor.remove(actorMaterial.materialType);
    }
    actor.add(new ActorMaterial(this));
  }
  removedFromActor(actor) {
    actor.remove(ActorMaterial);
  }
};

// src/materials/unlit.ts
var UnlitMaterial = class extends MaterialBase {
  static {
    __name(this, "UnlitMaterial");
  }
  static SharedComponent = true;
  uniformBuffer;
  materialBindGroup;
  label;
  transparent;
  doubleSided;
  baseColorFactor;
  baseColorTexture;
  baseAlbedo;
  canDecal;
  constructor(gpu, desc) {
    super();
    this.label = desc?.label;
    this.transparent = desc?.transparent ?? false;
    this.doubleSided = desc?.doubleSided ?? false;
    this.baseColorFactor = new Vec4(desc?.baseColorFactor ?? [1, 1, 1, 1]);
    this.baseColorTexture = desc?.baseColorTexture ?? gpu.whiteTexture;
    this.baseAlbedo = new Vec3(desc?.baseAlbedo ?? [1, 1, 1]);
    this.canDecal = desc?.canDecal ?? false;
    this.uniformBuffer = gpu.device.createBuffer({
      label: "Unlit Material",
      size: Vec4.BYTE_LENGTH * 2,
      usage: GPUBufferUsage.UNIFORM,
      mappedAtCreation: true
    });
    this.materialBindGroup = gpu.device.createBindGroup({
      label: "Unlit Material",
      layout: gpu.unlitPipelineFactory.materialBGL,
      entries: [{
        binding: 0,
        resource: this.uniformBuffer
      }, {
        binding: 1,
        resource: this.baseColorTexture
      }, {
        binding: 2,
        resource: gpu.defaultSampler
      }]
    });
    const mapped = new Float32Array(this.uniformBuffer.getMappedRange());
    mapped.set(this.baseColorFactor, 0);
    mapped.set(this.baseAlbedo, 4);
    this.uniformBuffer.unmap();
    Object.freeze(this);
  }
};

// src/util/wgsl-preprocessor.ts
var preprocessorSymbols = /#([^\s]*)(\s*)/gm;
var ConditionalState = class {
  static {
    __name(this, "ConditionalState");
  }
  elseIsValid = true;
  branches = [];
  constructor(initialExpression) {
    this.pushBranch("if", initialExpression);
  }
  pushBranch(token, expression) {
    if (!this.elseIsValid) {
      throw new Error(`#${token} not preceeded by an #if or #elif`);
    }
    this.elseIsValid = token === "if" || token === "elif";
    this.branches.push({
      expression: !!expression,
      string: ""
    });
  }
  appendStringToCurrentBranch(...strings) {
    for (const str of strings) {
      this.branches[this.branches.length - 1].string += str;
    }
  }
  resolve() {
    for (const branch of this.branches) {
      if (branch.expression) {
        return branch.string;
      }
    }
    return "";
  }
};
function wgsl(strings, ...values) {
  const stateStack = [];
  let state = new ConditionalState(true);
  state.elseIsValid = false;
  let depth = 1;
  const assertTemplateFollows = /* @__PURE__ */ __name((match, str) => {
    if (match.index + match[0].length != str.length) {
      throw new Error(`#${match[1]} must be immediately followed by a template expression (ie: \${value})`);
    }
  }, "assertTemplateFollows");
  for (let i = 0; i < strings.length; ++i) {
    const str = strings[i];
    const matchedSymbols = str.matchAll(preprocessorSymbols);
    let lastIndex = 0;
    let valueConsumed = false;
    for (const match of matchedSymbols) {
      state.appendStringToCurrentBranch(str.substring(lastIndex, match.index));
      switch (match[1]) {
        case "if":
          assertTemplateFollows(match, str);
          valueConsumed = true;
          stateStack.push(state);
          state = new ConditionalState(values[i]);
          break;
        case "elif":
          assertTemplateFollows(match, str);
          valueConsumed = true;
          state.pushBranch(match[1], values[i]);
          break;
        case "else":
          state.pushBranch(match[1], true);
          state.appendStringToCurrentBranch(match[2]);
          break;
        case "endif":
          if (!stateStack.length) {
            throw new Error(`#${match[1]} not preceeded by an #if`);
          }
          const result = state.resolve();
          state = stateStack.pop();
          state.appendStringToCurrentBranch(result, match[2]);
          break;
        default:
          state.appendStringToCurrentBranch(match[0]);
          break;
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex != str.length) {
      state.appendStringToCurrentBranch(str.substring(lastIndex, str.length));
    }
    if (!valueConsumed && values.length > i) {
      state.appendStringToCurrentBranch(values[i]);
    }
  }
  if (stateStack.length) {
    throw new Error("Mismatched #if/#endif count");
  }
  return state.resolve();
}
__name(wgsl, "wgsl");

// src/geometry/geometry-layout.ts
var TopologyId = /* @__PURE__ */ ((TopologyId2) => {
  TopologyId2[TopologyId2["point-list"] = 0] = "point-list";
  TopologyId2[TopologyId2["line-list"] = 1] = "line-list";
  TopologyId2[TopologyId2["line-strip"] = 2] = "line-strip";
  TopologyId2[TopologyId2["triangle-strip"] = 3] = "triangle-strip";
  TopologyId2[TopologyId2["triangle-list"] = 4] = "triangle-list";
  return TopologyId2;
})(TopologyId || {});
var TopologyMask = 0 /* point-list */ | 1 /* line-list */ | 2 /* line-strip */ | 3 /* triangle-strip */ | 4 /* triangle-list */;
var StripIndexFormatId = /* @__PURE__ */ ((StripIndexFormatId2) => {
  StripIndexFormatId2[StripIndexFormatId2["uint16"] = 0] = "uint16";
  StripIndexFormatId2[StripIndexFormatId2["uint32"] = 16] = "uint32";
  return StripIndexFormatId2;
})(StripIndexFormatId || {});
var FormatId = /* @__PURE__ */ ((FormatId2) => {
  FormatId2[FormatId2["uint8x2"] = 0] = "uint8x2";
  FormatId2[FormatId2["uint8x4"] = 1] = "uint8x4";
  FormatId2[FormatId2["sint8x2"] = 2] = "sint8x2";
  FormatId2[FormatId2["sint8x4"] = 3] = "sint8x4";
  FormatId2[FormatId2["unorm8x2"] = 4] = "unorm8x2";
  FormatId2[FormatId2["unorm8x4"] = 5] = "unorm8x4";
  FormatId2[FormatId2["snorm8x2"] = 6] = "snorm8x2";
  FormatId2[FormatId2["snorm8x4"] = 7] = "snorm8x4";
  FormatId2[FormatId2["uint16x2"] = 8] = "uint16x2";
  FormatId2[FormatId2["uint16x4"] = 9] = "uint16x4";
  FormatId2[FormatId2["sint16x2"] = 10] = "sint16x2";
  FormatId2[FormatId2["sint16x4"] = 11] = "sint16x4";
  FormatId2[FormatId2["unorm16x2"] = 12] = "unorm16x2";
  FormatId2[FormatId2["unorm16x4"] = 13] = "unorm16x4";
  FormatId2[FormatId2["snorm16x2"] = 14] = "snorm16x2";
  FormatId2[FormatId2["snorm16x4"] = 15] = "snorm16x4";
  FormatId2[FormatId2["float16x2"] = 16] = "float16x2";
  FormatId2[FormatId2["float16x4"] = 17] = "float16x4";
  FormatId2[FormatId2["float32"] = 18] = "float32";
  FormatId2[FormatId2["float32x2"] = 19] = "float32x2";
  FormatId2[FormatId2["float32x3"] = 20] = "float32x3";
  FormatId2[FormatId2["float32x4"] = 21] = "float32x4";
  FormatId2[FormatId2["uint32"] = 22] = "uint32";
  FormatId2[FormatId2["uint32x2"] = 23] = "uint32x2";
  FormatId2[FormatId2["uint32x3"] = 24] = "uint32x3";
  FormatId2[FormatId2["uint32x4"] = 25] = "uint32x4";
  FormatId2[FormatId2["sint32"] = 26] = "sint32";
  FormatId2[FormatId2["sint32x2"] = 27] = "sint32x2";
  FormatId2[FormatId2["sint32x3"] = 28] = "sint32x3";
  FormatId2[FormatId2["sint32x4"] = 29] = "sint32x4";
  return FormatId2;
})(FormatId || {});
var StepModeId = /* @__PURE__ */ ((StepModeId2) => {
  StepModeId2[StepModeId2["vertex"] = 0] = "vertex";
  StepModeId2[StepModeId2["instance"] = 32768] = "instance";
  return StepModeId2;
})(StepModeId || {});
var GeometryLayout = class _GeometryLayout {
  static {
    __name(this, "GeometryLayout");
  }
  // Caching
  static #nextId = 1;
  static #keyMap = /* @__PURE__ */ new Map();
  // Map of the given key to an ID
  static #cache = /* @__PURE__ */ new Map();
  // Map of ID to cached resource
  static GetById(id) {
    return this.#cache.get(id);
  }
  static #AddToCache(layout, key) {
    layout.id = this.#nextId++;
    Object.freeze(layout);
    this.#keyMap.set(key, layout.id);
    this.#cache.set(layout.id, layout);
    return layout;
  }
  static Deserialize(value) {
    const id = this.#keyMap.get(value);
    if (id !== void 0) {
      return this.#cache.get(id);
    }
    const buffer = HexStringToBuffer(value);
    const layout = _GeometryLayout.#DeserializeFromBuffer(buffer);
    layout.#serializedBuffer = buffer;
    layout.#serializedString = value;
    return this.#AddToCache(layout, value);
  }
  static #DeserializeFromBuffer(inBuffer, bufferOffest, bufferLength) {
    const dataView = new DataView(inBuffer, bufferOffest, bufferLength);
    const topologyData8 = dataView.getUint8(0);
    const topology = TopologyId[topologyData8 & TopologyMask];
    let stripIndexFormat = "uint32";
    switch (topology) {
      case "triangle-strip":
      case "line-strip":
        stripIndexFormat = StripIndexFormatId[topologyData8 & 240];
    }
    const buffers = [];
    let offset = 1;
    while (offset < dataView.byteLength) {
      const bufferData16 = dataView.getUint16(offset, true);
      const attribCount = bufferData16 & 15;
      let buffer = {
        attributes: new Array(attribCount),
        arrayStride: bufferData16 >> 4 & 2303,
        stepMode: StepModeId[bufferData16 & 32768]
      };
      buffers.push(buffer);
      offset += 2;
      for (let i = 0; i < attribCount; ++i) {
        const attribData16 = dataView.getUint16(offset, true);
        buffer.attributes[i] = {
          offset: attribData16 & 4095,
          shaderLocation: attribData16 >> 12 & 15,
          format: FormatId[dataView.getUint8(offset + 2)]
        };
        offset += 3;
      }
    }
    return new _GeometryLayout(buffers, topology, stripIndexFormat);
  }
  // Layout
  id;
  buffers;
  topology;
  stripIndexFormat;
  #serializedBuffer;
  #serializedString;
  #locationsUsed;
  #locationsInfo;
  constructor(attribBuffers, topology = "triangle-list", indexFormat = "uint32") {
    this.id = 0;
    this.buffers = structuredClone(attribBuffers);
    this.topology = topology;
    if (topology == "triangle-strip" || topology == "line-strip") {
      this.stripIndexFormat = indexFormat;
    }
    const key = this.serializeToString();
    const id = _GeometryLayout.#keyMap.get(key);
    if (id !== void 0) {
      return _GeometryLayout.#cache.get(id);
    }
    this.id = _GeometryLayout.#nextId++;
    _GeometryLayout.#AddToCache(this, key);
  }
  get locationsUsed() {
    if (!this.#locationsUsed) {
      this.#locationsUsed = /* @__PURE__ */ new Set();
      for (const buffer of this.buffers) {
        for (const attrib of buffer.attributes) {
          this.#locationsUsed.add(attrib.shaderLocation);
        }
      }
    }
    return this.#locationsUsed;
  }
  getLocationInfo(shaderLocation) {
    if (!this.#locationsInfo) {
      this.#locationsInfo = /* @__PURE__ */ new Map();
      for (let i = 0; i < this.buffers.length; ++i) {
        const buffer = this.buffers[i];
        for (const attrib of buffer.attributes) {
          this.#locationsInfo.set(attrib.shaderLocation, {
            bufferIndex: i,
            stride: buffer.arrayStride,
            offset: attrib.offset,
            format: attrib.format
          });
        }
      }
    }
    return this.#locationsInfo.get(shaderLocation);
  }
  getLocationBaseType(shaderLocation) {
    const format = this.getLocationInfo(shaderLocation)?.format;
    if (!format) {
      return void 0;
    }
    if (format.startsWith("float") || format.startsWith("unorm") || format.startsWith("snorm")) {
      return "f32";
    } else if (format.startsWith("uint")) {
      return "u32";
    } else if (format.startsWith("sint")) {
      return "i32";
    }
    console.error(`Shader Location ${shaderLocation} has format "${format}" with an unknown base type.`);
    return void 0;
  }
  getStandardVertexInStruct(structName = "VertexIn") {
    const used = this.locationsUsed;
    return wgsl`
      struct ${structName} {
      #if ${used.has(AttribLocation.position)}
          @location(${AttribLocation.position}) position: vec4<${this.getLocationBaseType(AttribLocation.position)}>,
      #endif
      #if ${used.has(AttribLocation.normal)}
          @location(${AttribLocation.normal}) normal: vec3<${this.getLocationBaseType(AttribLocation.normal)}>,
      #endif
      #if ${used.has(AttribLocation.tangent)}
          @location(${AttribLocation.tangent}) tangent: vec4<${this.getLocationBaseType(AttribLocation.tangent)}>,
      #endif
      #if ${used.has(AttribLocation.texcoord0)}
          @location(${AttribLocation.texcoord0}) texcoord0: vec2<${this.getLocationBaseType(AttribLocation.texcoord0)}>,
      #endif
      #if ${used.has(AttribLocation.texcoord1)}
          @location(${AttribLocation.texcoord1}) texcoord1: vec2<${this.getLocationBaseType(AttribLocation.texcoord1)}>,
      #endif
      #if ${used.has(AttribLocation.color)}
          @location(${AttribLocation.color}) color: vec4<${this.getLocationBaseType(AttribLocation.color)}>,
      #endif
      #if ${used.has(AttribLocation.joints)}
          @location(${AttribLocation.joints}) joints: vec4<${this.getLocationBaseType(AttribLocation.joints)}>,
      #endif
      #if ${used.has(AttribLocation.weights)}
          @location(${AttribLocation.weights}) weights: vec4<${this.getLocationBaseType(AttribLocation.weights)}>,
      #endif
      }
    `;
  }
  // The GeometryLayout's binary serialized format is:
  //  - Byte 0, low 4 bits: Topology
  //  - Byte 0, high 4 bits: Index format (0 = 16 bit, 1 = 32 bit)
  // Then repeat till data's end:
  //  - First 16 bit value:
  //    - Lowest 4 bits: Number of attributes for buffer
  //    - Middle 11 bits: Array stride
  //    - High bit: Step mode (0 = vertex, 1 = instance)
  //  - Per attribute for this buffer:
  //    - First 16 bit value:
  //      - Lowest 12 bits: Attribute offset
  //      - Highest 4 bits: Shader location
  //    - Next 8 bit value: Attribute Format
  serializeToBuffer() {
    if (this.#serializedBuffer) {
      return this.#serializedBuffer;
    }
    let attribCount = 0;
    for (const buffer of this.buffers) {
      attribCount += buffer.attributes.length;
    }
    const byteLength = 1 + this.buffers.length * 2 + attribCount * 3;
    const outBuffer = new ArrayBuffer(byteLength);
    const dataView = new DataView(outBuffer);
    let topologyData8 = TopologyId[this.topology];
    if (this.stripIndexFormat !== void 0) {
      topologyData8 += StripIndexFormatId[this.stripIndexFormat];
    }
    dataView.setUint8(0, topologyData8);
    let offset = 1;
    for (const buffer of this.buffers) {
      let bufferData16 = buffer.attributes.length;
      bufferData16 += buffer.arrayStride << 4;
      bufferData16 += StepModeId[buffer.stepMode || "vertex"];
      dataView.setUint16(offset, bufferData16, true);
      offset += 2;
      for (const attrib of buffer.attributes) {
        let attribData16 = attrib.offset || 0;
        attribData16 += attrib.shaderLocation << 12;
        dataView.setUint16(offset, attribData16, true);
        dataView.setUint8(offset + 2, FormatId[attrib.format]);
        offset += 3;
      }
    }
    this.#serializedBuffer = outBuffer;
    return outBuffer;
  }
  // The string format is the same as the binary format, written in hex pairs.
  serializeToString() {
    if (!this.#serializedString) {
      this.#serializedString = BufferToHexString(this.serializeToBuffer());
    }
    return this.#serializedString;
  }
};

// src/geometry/geometry.ts
var AttribLocation = {
  position: 0,
  normal: 1,
  tangent: 2,
  texcoord0: 3,
  texcoord1: 4,
  color: 5,
  joints: 6,
  weights: 7
};
var Geometry = class _Geometry {
  static {
    __name(this, "Geometry");
  }
  static SharedComponent = true;
  static #nextId = 1;
  layout;
  drawCount;
  vertexCount;
  vertexBindings;
  indexBinding;
  label;
  //bounds: GeometryBounds;
  #id;
  /**
   * Create a new Geometry instance
   *
   * @param device - The GPUDevice to create the Geometry with
   * @param descriptor - Description of the Geometry to create
   */
  constructor(device, descriptor) {
    this.#id = _Geometry.#nextId++;
    let init;
    if ("layout" in descriptor) {
      init = descriptor;
    } else {
      init = _Geometry.#CreateBatchInit(device, [descriptor])[0];
    }
    this.layout = init.layout;
    this.drawCount = init.drawCount;
    this.vertexCount = init.vertexCount;
    this.vertexBindings = init.vertexBindings;
    this.indexBinding = init.indexBinding;
    this.label = init.label;
  }
  /**
   * Creates multiple geometries as part of a single batch, enabling them to share GPUBuffers.
   */
  static CreateBatch(device, descriptors) {
    const inits = _Geometry.#CreateBatchInit(device, descriptors);
    const geometries = [];
    for (const init of inits) {
      geometries.push(new _Geometry(device, init));
    }
    return geometries;
  }
  get id() {
    return this.#id;
  }
  /**
   * Binds the vertex and index buffers used by this geometry.
   * @param renderEncoder The RenderPassEncoder or RenderBundleEncoder to perform the binding with
   */
  bindBuffers(renderEncoder) {
    for (const binding of this.vertexBindings) {
      renderEncoder.setVertexBuffer(binding.slot, binding.buffer, binding.offset, binding.size);
    }
    const index = this.indexBinding;
    if (index) {
      renderEncoder.setIndexBuffer(index.buffer, index.format, index.offset, index.size);
    }
  }
  /**
   * Executes a simple instanced draw or drawIndexed, depending on the contents of this geometry.
   * For more specialized needs call the appropriate function with `drawCount` directly.
   * @param renderEncoder The RenderPassEncoder or RenderBundleEncoder to perform the binding with
   * @param instanceCount The number of instances to draw
   */
  draw(renderEncoder, instanceCount = 1, firstInstance = 0) {
    if (this.indexBinding) {
      renderEncoder.drawIndexed(this.drawCount, instanceCount, 0, 0, firstInstance);
    } else {
      renderEncoder.draw(this.drawCount, instanceCount, 0, firstInstance);
    }
  }
  /**
   * Binds the buffers used by this geometry and executes a simple instanced draw or drawIndexed
   * depending on the contents of this geometry.
   * @param renderEncoder The RenderPassEncoder or RenderBundleEncoder to perform the binding with
   * @param instanceCount The number of instances to draw
   */
  bindAndDraw(renderEncoder, instanceCount = 1, firstInstance = 0) {
    this.bindBuffers(renderEncoder);
    this.draw(renderEncoder, instanceCount, firstInstance);
  }
  static #CreateBatchInit(device, descriptors) {
    const batch = new GeometryAllocationBatch(descriptors);
    let vertexBuffer;
    let vertexByteArray;
    if (batch.requiredVertexBufferSize > 0) {
      vertexBuffer = device.createBuffer({
        label: "GeometryBatch_VertexBuffer",
        size: batch.requiredVertexBufferSize,
        usage: batch.vertexUsage,
        mappedAtCreation: true
      });
      vertexByteArray = new Uint8Array(vertexBuffer.getMappedRange());
    } else {
      vertexByteArray = new Uint8Array(0);
    }
    let indexBuffer;
    let indexByteArray;
    if (batch.requiredIndexBufferSize > 0) {
      indexBuffer = device.createBuffer({
        label: "GeometryBatch_IndexBuffer",
        size: batch.requiredIndexBufferSize,
        usage: batch.indexUsage,
        mappedAtCreation: true
      });
      indexByteArray = new Uint8Array(indexBuffer.getMappedRange());
    } else {
      indexByteArray = new Uint8Array(0);
    }
    const geometries = [];
    for (const geometryInit of batch.geometryInits) {
      for (const source of geometryInit.vertexSources.values()) {
        if (source.byteArray && vertexByteArray) {
          vertexByteArray.set(source.byteArray, source.bufferOffset);
        }
      }
      const vertexBindings = [];
      for (let slot = 0; slot < geometryInit.bufferLayouts.length; ++slot) {
        const layout = geometryInit.bufferLayouts[slot];
        vertexBindings.push({
          slot,
          buffer: layout.buffer?.buffer ?? vertexBuffer,
          offset: layout.bufferOffset ?? 0,
          size: layout.bufferSize
        });
      }
      let indexBinding;
      if (geometryInit.indexSource) {
        if (geometryInit.indexSource.byteArray) {
          indexByteArray.set(geometryInit.indexSource.byteArray, geometryInit.indexSource.bufferOffset);
        }
        indexBinding = {
          buffer: geometryInit.indexSource?.buffer ?? indexBuffer,
          format: geometryInit.indexFormat ?? "uint16",
          offset: geometryInit.indexSource.bufferOffset,
          size: geometryInit.drawCount * (geometryInit.indexFormat == "uint32" ? 4 : 2)
        };
      }
      geometries.push({
        layout: geometryInit.layout,
        drawCount: geometryInit.drawCount,
        vertexCount: geometryInit.vertexCount,
        label: geometryInit.label,
        vertexBindings,
        indexBinding
        //bounds: geometryInit.bounds,
      });
    }
    vertexBuffer?.unmap();
    indexBuffer?.unmap();
    return geometries;
  }
};
function nextMultipleOf(multiple, value) {
  return Math.ceil(value / multiple) * multiple;
}
__name(nextMultipleOf, "nextMultipleOf");
var DefaultAttribFormat = {
  position: "float32x3",
  normal: "float32x3",
  tangent: "float32x3",
  texcoord0: "float32x2",
  texcoord1: "float32x2",
  color: "float32x4",
  joints: "uint16x4",
  weights: "float32x4"
};
var DefaultStride = {
  uint8x2: 2,
  uint8x4: 4,
  sint8x2: 2,
  sint8x4: 4,
  unorm8x2: 2,
  unorm8x4: 4,
  snorm8x2: 2,
  snorm8x4: 4,
  uint16x2: 4,
  uint16x4: 8,
  sint16x2: 4,
  sint16x4: 8,
  unorm16x2: 4,
  unorm16x4: 8,
  snorm16x2: 4,
  snorm16x4: 8,
  float16x2: 4,
  float16x4: 8,
  float32: 4,
  float32x2: 8,
  float32x3: 12,
  float32x4: 16,
  uint32: 4,
  uint32x2: 8,
  uint32x3: 12,
  uint32x4: 16,
  sint32: 4,
  sint32x2: 8,
  sint32x3: 12,
  sint32x4: 16
};
var GeometryAllocationBatch = class {
  static {
    __name(this, "GeometryAllocationBatch");
  }
  geometryInits = [];
  requiredVertexBufferSize = 0;
  requiredIndexBufferSize = 0;
  vertexUsage = 0;
  indexUsage = 0;
  constructor(descArray) {
    let bufferSources = 0;
    for (const desc of descArray) {
      let vertexBufferLayouts = [];
      let maxVertices = Number.MAX_SAFE_INTEGER;
      let arraySources = /* @__PURE__ */ new Map();
      this.vertexUsage |= desc.vertexUsage ?? GPUBufferUsage.VERTEX;
      this.indexUsage |= desc.indexUsage ?? GPUBufferUsage.INDEX;
      for (const attribName of Object.keys(AttribLocation)) {
        const attrib = desc[attribName];
        if (attrib === void 0) {
          continue;
        }
        let offset = attrib.offset ?? 0;
        const format = attrib?.format ?? DefaultAttribFormat[attribName];
        const arrayStride = attrib?.stride ?? DefaultStride[format];
        const shaderLocation = AttribLocation[attribName];
        let source;
        if (attrib.buffer) {
          bufferSources++;
          source = arraySources.get(attrib.buffer);
          const size = attrib.size ?? attrib.buffer.size;
          if (!source) {
            source = {
              buffer: attrib.buffer,
              bufferOffset: attrib.offset,
              size
            };
            arraySources.set(attrib.buffer, source);
          }
          maxVertices = Math.min(maxVertices, size / arrayStride);
        } else {
          const values = attrib.values ?? attrib;
          source = arraySources.get(values);
          if (!source) {
            let byteArray;
            if (ArrayBuffer.isView(values)) {
              byteArray = new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
            } else if (values instanceof ArrayBuffer) {
              byteArray = new Uint8Array(values);
            } else if (Array.isArray(values)) {
              byteArray = new Uint8Array(new Float32Array(values).buffer);
            } else {
              throw new Error(`Unknown values type in attribute ${attribName}`);
            }
            source = {
              byteArray,
              bufferOffset: this.requiredVertexBufferSize,
              size: byteArray.byteLength
            };
            arraySources.set(values, source);
            this.requiredVertexBufferSize += nextMultipleOf(4, byteArray.byteLength);
            maxVertices = Math.min(maxVertices, byteArray.byteLength / arrayStride);
          }
          offset += source.bufferOffset;
        }
        vertexBufferLayouts.push({
          buffer: source,
          arrayStride,
          attributes: [{
            shaderLocation,
            format,
            offset
          }]
        });
      }
      const vertexCount = desc.vertexCount ?? maxVertices;
      if (vertexCount > maxVertices) {
        console.warn(`The given number of vertices for this geometry (${vertexCount}) is greater than the
          maximum number of vertices provided by the passed arrays (${maxVertices}).`);
      }
      const bufferLayouts = NormalizeBufferLayout([...vertexBufferLayouts.values()]);
      let indexSource;
      let indexCount = 0;
      let indexFormat;
      if (desc.indices) {
        if ("format" in desc.indices) {
          const indices = desc.indices;
          indexSource = {
            buffer: indices.buffer,
            bufferOffset: indices.offset
          };
          indexFormat = indices.format;
          indexCount = (indices.size ?? indices.buffer.size) / (indexFormat == "uint32" ? 4 : 2);
        } else {
          const indices = desc.indices;
          indexSource = {
            byteArray: void 0,
            bufferOffset: this.requiredIndexBufferSize
          };
          if (Array.isArray(indices)) {
            indexSource.byteArray = new Uint8Array(new Uint32Array(indices).buffer);
            indexCount = indices.length;
            indexFormat = "uint32";
          } else if (indices instanceof Uint32Array) {
            indexSource.byteArray = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
            indexCount = desc.indices.length;
            indexFormat = "uint32";
          } else if (indices instanceof Uint16Array) {
            indexSource.byteArray = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
            indexCount = indices.length;
            indexFormat = "uint16";
          } else if (indices instanceof Uint8Array) {
            const indexShortArray = new Uint16Array(indices.length);
            indexShortArray.set(indices);
            indexSource.byteArray = new Uint8Array(indexShortArray.buffer);
            indexFormat = "uint16";
          } else {
            throw new Error(`Unknown indices type`);
          }
          this.requiredIndexBufferSize += nextMultipleOf(4, indexSource.byteArray.byteLength);
        }
      }
      const layout = new GeometryLayout(bufferLayouts, desc.topology ?? "triangle-list", indexFormat);
      let drawCount = desc.drawCount;
      if (drawCount === void 0) {
        if (indexSource) {
          drawCount = indexCount;
        } else if (arraySources.size > 0) {
          drawCount = vertexCount;
        } else {
          throw new Error("drawCount must be defined if no attributes or indices are given");
        }
      }
      this.geometryInits.push({
        layout,
        drawCount,
        vertexCount,
        vertexSources: [...arraySources.values()],
        bufferLayouts,
        indexSource,
        indexFormat,
        //bounds,
        label: desc.label
      });
    }
    if (this.requiredVertexBufferSize == 0 && bufferSources == 0) {
      throw new Error("No vertex data provided");
    }
  }
};
function NormalizeBufferLayout(bufferLayouts) {
  const bufferStrideAttribs = /* @__PURE__ */ new Map();
  for (const layout of bufferLayouts) {
    if (layout.attributes.length == 0) {
      continue;
    }
    let bufferStrides = bufferStrideAttribs.get(layout.buffer);
    if (!bufferStrides) {
      bufferStrides = /* @__PURE__ */ new Map();
      bufferStrideAttribs.set(layout.buffer, bufferStrides);
    }
    let strideAttribs = bufferStrides.get(layout.arrayStride);
    if (!strideAttribs) {
      strideAttribs = [];
      bufferStrides.set(layout.arrayStride, strideAttribs);
    }
    for (const attrib of layout.attributes) {
      strideAttribs.push({
        shaderLocation: attrib.shaderLocation,
        offset: attrib.offset + (layout.bufferOffset ?? 0),
        format: attrib.format
      });
    }
  }
  const normalizedLayouts = [];
  const pushLayout = /* @__PURE__ */ __name((buffer, bufferOffset, arrayStride, attributes) => {
    normalizedLayouts.push({
      buffer,
      bufferOffset,
      arrayStride,
      attributes: attributes.sort((a, b) => a.shaderLocation - b.shaderLocation)
    });
  }, "pushLayout");
  for (const [buffer, strideAttribs] of bufferStrideAttribs) {
    for (const [stride, attribs] of strideAttribs) {
      attribs.sort((a, b) => a.offset - b.offset);
      let minAttribOffset = attribs[0].offset;
      let attributes = [];
      for (const attrib of attribs) {
        let adjustedOffset = attrib.offset - minAttribOffset;
        if (adjustedOffset >= stride) {
          pushLayout(buffer, minAttribOffset, stride, attributes);
          minAttribOffset = attrib.offset;
          adjustedOffset = 0;
          attributes = [];
        }
        attributes.push({
          offset: adjustedOffset,
          shaderLocation: attrib.shaderLocation,
          format: attrib.format
        });
      }
      pushLayout(buffer, minAttribOffset, stride, attributes);
    }
  }
  return normalizedLayouts.sort((a, b) => a.attributes[0].shaderLocation - b.attributes[0].shaderLocation);
}
__name(NormalizeBufferLayout, "NormalizeBufferLayout");

// src/renderer/instance-manager.ts
function nextMultipleOf2(multiple, value) {
  return Math.ceil(value / multiple) * multiple;
}
__name(nextMultipleOf2, "nextMultipleOf");
var GeometryInstances = class {
  static {
    __name(this, "GeometryInstances");
  }
  geometry;
  instances = [];
  mirroredInstances = [];
  indexOffset = -1;
  mirroredIndexOffset = -1;
  constructor(geometry) {
    this.geometry = geometry;
  }
  addInstance(actor) {
    if (actor.worldTransform.mirrored) {
      this.mirroredInstances.push(actor);
    } else {
      this.instances.push(actor);
    }
  }
  get instanceCount() {
    return this.instances.length;
  }
  get mirroredInstanceCount() {
    return this.mirroredInstances.length;
  }
};
var MaterialGeometries = class {
  static {
    __name(this, "MaterialGeometries");
  }
  material;
  geometries = /* @__PURE__ */ new Map();
  instanceCount = 0;
  constructor(material) {
    this.material = material;
  }
  addInstance(geometry, actor) {
    let geometryInstances = this.geometries.get(geometry);
    if (!geometryInstances) {
      geometryInstances = new GeometryInstances(geometry);
      this.geometries.set(geometry, geometryInstances);
    }
    geometryInstances.addInstance(actor);
    this.instanceCount++;
  }
};
var InstanceBuffers = class {
  static {
    __name(this, "InstanceBuffers");
  }
  gpu;
  maxInstanceCount;
  instanceTransformArray;
  instanceIndexArray;
  instanceTransformBuffer;
  instanceIndexBuffer;
  constructor(gpu, maxInstanceCount) {
    this.gpu = gpu;
    this.maxInstanceCount = maxInstanceCount;
    this.instanceTransformArray = new Float32Array(maxInstanceCount * 28);
    this.instanceIndexArray = new Uint32Array(maxInstanceCount);
    this.instanceTransformBuffer = gpu.device.createBuffer({
      label: "Instance Transform Buffer",
      size: this.instanceTransformArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });
    this.instanceIndexBuffer = gpu.device.createBuffer({
      label: "Instance Index Buffer",
      size: this.instanceIndexArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });
  }
  update(materials) {
    let transformOffset = 0;
    let indexOffset = 0;
    const setNormalMat = /* @__PURE__ */ __name((normal, offset) => {
      this.instanceTransformArray[offset + 0] = normal[0];
      this.instanceTransformArray[offset + 1] = normal[1];
      this.instanceTransformArray[offset + 2] = normal[2];
      this.instanceTransformArray[offset + 4] = normal[3];
      this.instanceTransformArray[offset + 5] = normal[4];
      this.instanceTransformArray[offset + 6] = normal[5];
      this.instanceTransformArray[offset + 8] = normal[6];
      this.instanceTransformArray[offset + 9] = normal[7];
      this.instanceTransformArray[offset + 10] = normal[8];
    }, "setNormalMat");
    for (let materialGeometries of materials.values()) {
      for (let geometryInstances of materialGeometries.geometries.values()) {
        if (geometryInstances.instances.length) {
          geometryInstances.indexOffset = indexOffset;
          for (let instance of geometryInstances.instances) {
            this.instanceTransformArray.set(instance.worldTransform.matrix, transformOffset);
            setNormalMat(instance.worldTransform.normalMatrix, transformOffset + 16);
            this.instanceIndexArray[indexOffset] = indexOffset++;
            transformOffset += 28;
          }
        }
        if (geometryInstances.mirroredInstances) {
          geometryInstances.mirroredIndexOffset = indexOffset;
          for (let instance of geometryInstances.mirroredInstances) {
            this.instanceTransformArray.set(instance.worldTransform.matrix, transformOffset);
            setNormalMat(instance.worldTransform.normalMatrix, transformOffset + 16);
            this.instanceIndexArray[indexOffset] = indexOffset++;
            transformOffset += 28;
          }
        }
      }
    }
    this.gpu.device.queue.writeBuffer(this.instanceTransformBuffer, 0, this.instanceTransformArray, 0, transformOffset);
    this.gpu.device.queue.writeBuffer(this.instanceIndexBuffer, 0, this.instanceIndexArray, 0, indexOffset);
  }
};
var InstanceManager = class {
  static {
    __name(this, "InstanceManager");
  }
  gpu;
  materials = /* @__PURE__ */ new Map();
  instanceCount = 0;
  instanceBuffers;
  constructor(gpu) {
    this.gpu = gpu;
  }
  #clear() {
    this.materials.clear();
    this.instanceCount = 0;
  }
  #addInstance(material, geometry, actor) {
    let materialGeometries = this.materials.get(material);
    if (!materialGeometries) {
      materialGeometries = new MaterialGeometries(material);
      this.materials.set(material, materialGeometries);
    }
    materialGeometries.addInstance(geometry, actor);
    this.instanceCount++;
  }
  updateInstances(stage) {
    this.#clear();
    stage.query(Geometry, ActorMaterial).forEach((actor, geometry, material) => {
      this.#addInstance(material.material, geometry, actor);
    });
    let buffersUpdated = false;
    if (!this.instanceBuffers || this.instanceBuffers.maxInstanceCount < this.instanceCount) {
      this.instanceBuffers = new InstanceBuffers(this.gpu, nextMultipleOf2(128, this.instanceCount));
      this.gpu.frameBindingsDirty();
    }
    this.instanceBuffers.update(this.materials);
  }
};

// src/loaders/texture/mipmap-generator.ts
var mipmapShader = (
  /* wgsl */
  `
  var<private> pos : array<vec2f, 3> = array<vec2f, 3>(
    vec2f(-1, -1), vec2f(-1, 3), vec2f(3, -1));

  struct VertexOutput {
    @builtin(position) position : vec4f,
    @location(0) texCoord : vec2f,
  };

  @vertex
  fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
    return VertexOutput(
      vec4(pos[vertexIndex], 0.0, 1.0), // position
      pos[vertexIndex] * vec2f(0.5, -0.5) + vec2f(0.5) // texCoord
    );
  }

  @group(0) @binding(0) var imgSampler : sampler;
  @group(0) @binding(1) var img : texture_2d<f32>;

  @fragment
  fn fragmentMain(@location(0) texCoord : vec2f) -> @location(0) vec4f {
    return textureSample(img, imgSampler, texCoord);
  }
`
);
var WebGPUMipmapGenerator = class {
  constructor(device) {
    this.device = device;
  }
  device;
  static {
    __name(this, "WebGPUMipmapGenerator");
  }
  #resources;
  // We'll need a new pipeline for every texture format used.
  #pipelines = /* @__PURE__ */ new Map();
  /**
   * Determines the number of mip levels needed for a full mip chain given the width and height of texture level 0.
   *
   * @param width of texture level 0.
   * @param height of texture level 0.
   * @returns Ideal number of mip levels.
   */
  static calculateMipLevels(width, height) {
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
  }
  #ensureSharedResources() {
    if (!this.#resources) {
      const bindGroupLayout = this.device.createBindGroupLayout({
        label: "Mipmap Generator Bind Group Layout",
        entries: [{
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {}
        }, {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {}
        }]
      });
      this.#resources = {
        module: this.device.createShaderModule({
          label: "Mipmap Generator Shader",
          code: mipmapShader
        }),
        sampler: this.device.createSampler({
          label: "Mipmap Generator Sampler",
          minFilter: "linear"
        }),
        bindGroupLayout,
        pipelineLayout: this.device.createPipelineLayout({
          label: "Mipmap Generator Pipeline Layout",
          bindGroupLayouts: [bindGroupLayout]
        })
      };
    }
    return this.#resources;
  }
  #getMipmapPipeline(format) {
    let pipeline = this.#pipelines.get(format);
    if (!pipeline) {
      const { pipelineLayout, module } = this.#ensureSharedResources();
      pipeline = this.device.createRenderPipeline({
        label: `Mipmap Generator ${format} Render Pipeline`,
        layout: pipelineLayout,
        vertex: { module },
        fragment: {
          module,
          targets: [{ format }]
        }
      });
      this.#pipelines.set(format, pipeline);
    }
    return pipeline;
  }
  /**
   * Generates mipmaps for the given GPUTexture from the data in level 0.
   *
   * @param texture - Texture to generate mipmaps for.
   */
  generateMipmap(texture, layer) {
    if (texture.dimension == "3d" || texture.dimension == "1d") {
      throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");
    }
    const pipeline = this.#getMipmapPipeline(texture.format);
    const { bindGroupLayout, sampler } = this.#ensureSharedResources();
    let mipTexture = texture;
    const baseArrayLayer = layer ?? 0;
    const arrayLayerCount = layer !== void 0 ? 1 : texture.depthOrArrayLayers;
    const renderToSource = texture.usage & GPUTextureUsage.RENDER_ATTACHMENT;
    if (!renderToSource) {
      const mipTextureDescriptor = {
        size: {
          width: Math.max(texture.width >> 1, 1),
          height: Math.max(texture.height >> 1, 1),
          depthOrArrayLayers: arrayLayerCount
        },
        format: texture.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
        mipLevelCount: texture.mipLevelCount - 1
      };
      mipTexture = this.device.createTexture(mipTextureDescriptor);
    }
    const commandEncoder = this.device.createCommandEncoder({});
    for (let arrayLayer = baseArrayLayer; arrayLayer < baseArrayLayer + arrayLayerCount; ++arrayLayer) {
      let srcView = texture.createView({
        baseMipLevel: 0,
        mipLevelCount: 1,
        dimension: "2d",
        baseArrayLayer: arrayLayer,
        arrayLayerCount: 1
      });
      let dstMipLevel = renderToSource ? 1 : 0;
      for (let i = 1; i < texture.mipLevelCount; ++i) {
        const dstView = mipTexture.createView({
          baseMipLevel: dstMipLevel++,
          mipLevelCount: 1,
          dimension: "2d",
          baseArrayLayer: arrayLayer,
          arrayLayerCount: 1
        });
        const bindGroup = this.device.createBindGroup({
          layout: bindGroupLayout,
          entries: [{
            binding: 0,
            resource: sampler
          }, {
            binding: 1,
            resource: srcView
          }]
        });
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: dstView,
            loadOp: "clear",
            storeOp: "store"
          }]
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3);
        passEncoder.end();
        srcView = dstView;
      }
    }
    if (!renderToSource) {
      const mipLevelSize = {
        width: Math.max(texture.width >> 1, 1),
        height: Math.max(texture.height >> 1, 1),
        depthOrArrayLayers: arrayLayerCount
      };
      for (let i = 1; i < texture.mipLevelCount; ++i) {
        commandEncoder.copyTextureToTexture({
          texture: mipTexture,
          mipLevel: i - 1
        }, {
          texture,
          mipLevel: i
        }, mipLevelSize);
        mipLevelSize.width = Math.max(mipLevelSize.width >> 1, 1);
        mipLevelSize.height = Math.max(mipLevelSize.height >> 1, 1);
      }
    }
    this.device.queue.submit([commandEncoder.finish()]);
    if (!renderToSource) {
      mipTexture.destroy();
    }
    return texture;
  }
};

// src/util/worker-pool.ts
var WORKER_DIR = import.meta.url.replace(/[^\/]*$/, "../../workers/");
var WorkerPool = class {
  static {
    __name(this, "WorkerPool");
  }
  #workerPath;
  #maxWorkerPoolSize;
  #onMessage;
  #pendingWorkItems = /* @__PURE__ */ new Map();
  #nextWorkItemId = 1;
  #workerPool = [];
  #nextWorker = 0;
  constructor(workerPath, maxWorkerPoolSize = void 0) {
    this.#workerPath = WORKER_DIR + workerPath;
    this.#maxWorkerPoolSize = maxWorkerPoolSize ?? Math.min(4, navigator.hardwareConcurrency);
    this.#onMessage = (msg) => {
      const id = msg.data.id;
      const workItem = this.#pendingWorkItems.get(id);
      if (!workItem) {
        console.error(`Got a result for unknown work item ${id}`);
        return;
      }
      this.#pendingWorkItems.delete(id);
      if (msg.data.error) {
        workItem.reject(msg.data.error);
        return;
      }
      workItem.resolve(msg.data.result);
    };
  }
  #selectWorker(id, resolver) {
    this.#pendingWorkItems.set(id, resolver);
    if (this.#pendingWorkItems.size >= this.#workerPool.length && this.#workerPool.length < this.#maxWorkerPoolSize) {
      const worker = new Worker(this.#workerPath);
      worker.addEventListener("message", this.#onMessage);
      this.#workerPool.push(worker);
      return worker;
    }
    return this.#workerPool[this.#nextWorker++ % this.#workerPool.length];
  }
  dispatch(args, transfer) {
    return new Promise((resolve, reject) => {
      const id = this.#nextWorkItemId++;
      this.#selectWorker(id, { resolve, reject }).postMessage({
        id,
        args
      }, transfer ?? []);
    });
  }
};

// src/util/cache-helper.ts
var CacheHelper = class {
  constructor(cache) {
    this.cache = cache;
  }
  cache;
  static {
    __name(this, "CacheHelper");
  }
  setMulti(url, values) {
    const description = {};
    for (const key in values) {
      const value = values[key];
      const valueUrl = `${url}__${key}__`;
      if (value instanceof ArrayBuffer) {
        this.cache.put(valueUrl, new Response(value));
        description[key] = { type: "arrayBuffer", url: valueUrl };
      } else if (value instanceof Blob) {
        this.cache.put(valueUrl, new Response(value));
        description[key] = { type: "blob", url: valueUrl };
      } else {
        description[key] = { type: "literal", value };
      }
    }
    this.cache.put(url, new Response(JSON.stringify(description)));
  }
  async getMulti(url) {
    const response = await this.cache.match(url);
    if (!response) {
      return null;
    }
    const description = await response.json();
    const values = {};
    for (const key in description) {
      const entry = description[key];
      if (entry.type == "literal") {
        values[key] = entry.value;
      } else {
        const valueResponse = await this.cache.match(entry.url);
        if (!valueResponse) {
          this.cache.delete(url);
          return null;
        }
        values[key] = await valueResponse[entry.type]();
      }
    }
    return values;
  }
};

// src/loaders/texture/texture-loader-base.ts
var WebTextureFormats = {
  // Uncompressed formats
  "rgb8unorm": { canGenerateMipmaps: true },
  "rgba8unorm": { canGenerateMipmaps: true },
  "rgb8unorm-srgb": { canGenerateMipmaps: true },
  "rgba8unorm-srgb": { canGenerateMipmaps: true },
  "rgb565unorm": { canGenerateMipmaps: true },
  "rgba4unorm": { canGenerateMipmaps: true },
  "rgba5551unorm": { canGenerateMipmaps: true },
  "bgra8unorm": { canGenerateMipmaps: true },
  "bgra8unorm-srgb": { canGenerateMipmaps: true },
  // Floating point textures
  "rg11b10ufloat": { canGenerateMipmaps: false },
  // Compressed formats
  "bc1-rgb-unorm": {
    compressed: { blockBytes: 8, blockWidth: 4, blockHeight: 4 }
  },
  "bc2-rgba-unorm": {
    compressed: { blockBytes: 16, blockWidth: 4, blockHeight: 4 }
  },
  "bc3-rgba-unorm": {
    compressed: { blockBytes: 16, blockWidth: 4, blockHeight: 4 }
  },
  "bc7-rgba-unorm": {
    compressed: { blockBytes: 16, blockWidth: 4, blockHeight: 4 }
  },
  "etc1-rgb-unorm": {
    compressed: { blockBytes: 8, blockWidth: 4, blockHeight: 4 }
  },
  "etc2-rgba8unorm": {
    compressed: { blockBytes: 16, blockWidth: 4, blockHeight: 4 }
  },
  "astc-4x4-rgba-unorm": {
    compressed: { blockBytes: 16, blockWidth: 4, blockHeight: 4 }
  },
  "pvrtc1-4bpp-rgb-unorm": {
    compressed: { blockBytes: 8, blockWidth: 4, blockHeight: 4 }
  },
  "pvrtc1-4bpp-rgba-unorm": {
    compressed: { blockBytes: 8, blockWidth: 4, blockHeight: 4 }
  }
};
var EXTENSION_MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  apng: "image/apng",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  ico: "image/x-icon",
  cur: "image/x-icon",
  svg: "image/svg+xml",
  basis: "image/basis",
  ktx: "image/ktx",
  ktx2: "image/ktx2",
  dds: "image/vnd.ms-dds",
  hdr: "image/vnd.radiance",
  none: ""
};
var BasicTextureData = class {
  static {
    __name(this, "BasicTextureData");
  }
  type = "2d";
  format;
  size;
  arrayBuffer;
  mipLevelCount;
  bufferViews = [];
  constructor(format, width, height, imageData) {
    this.format = format;
    this.size = { width: Math.max(1, width), height: Math.max(1, height) };
    this.mipLevelCount = 0;
    this.arrayBuffer = imageData.buffer;
    this.bufferViews = [{
      levelSize: this.size,
      level: 0,
      layer: 0,
      face: 0,
      byteOffset: imageData.byteOffset,
      byteLength: imageData.byteLength
    }];
  }
};
var ExtensionHandler = class {
  static {
    __name(this, "ExtensionHandler");
  }
  mimeTypes;
  callback;
  loader = void 0;
  /**
   * Creates an ExtensionHandler.
   *
   * @param {Array<string>} extensions - List of extensions that this loader can handle.
   * @param {Function} callback - Callback which returns an instance of the loader.
   */
  constructor(mimeTypes, callback) {
    this.mimeTypes = mimeTypes;
    this.callback = callback;
  }
  /**
   * Gets the loader associated with this extension set. Creates an instance by calling the callback if one hasn't been
   * instantiated previously.
   *
   * @returns {object} Texture Loader instance.
   */
  getLoader() {
    if (!this.loader) {
      this.loader = this.callback();
    }
    return this.loader;
  }
};
var ImageLoader = class {
  static {
    __name(this, "ImageLoader");
  }
  static supportedMIMETypes() {
    return [
      "image/jpeg",
      "image/png",
      "image/apng",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/x-icon",
      "image/svg+xml"
    ];
  }
  async fromBlob(client, blob, options) {
    return client.fromImageBitmapBlob(blob, "rgba8unorm", options);
  }
  async fromBuffer(client, buffer, options) {
    const blob = new Blob([buffer], { type: options.mimeType });
    return this.fromBlob(client, blob, options);
  }
};
var WorkerLoader = class extends WorkerPool {
  static {
    __name(this, "WorkerLoader");
  }
  /**
   * Creates a WorkerLoader instance.
   *
   * @param relativeWorkerPath - Path to the worker script to load, relative to this file.
   */
  constructor(relativeWorkerPath) {
    super(relativeWorkerPath);
  }
  async fromBlob(client, blob, options) {
    const arrayBuffer = await blob.arrayBuffer();
    const textureData = await this.dispatch({
      arrayBuffer,
      supportedFormats: client.supportedFormats(),
      mipmaps: options.mipmaps,
      extension: options.extension
    }, [arrayBuffer]);
    return client.fromTextureData(textureData, options);
  }
  async fromBuffer(client, arrayBuffer, options) {
    const textureData = await this.dispatch({
      arrayBuffer,
      supportedFormats: client.supportedFormats(),
      mipmaps: options.mipmaps,
      extension: options.extension
    });
    return client.fromTextureData(textureData, options);
  }
};
var EXTENSION_HANDLERS = [
  new ExtensionHandler(ImageLoader.supportedMIMETypes(), () => new ImageLoader()),
  new ExtensionHandler(["image/ktx", "image/ktx2"], () => new WorkerLoader("ktx/ktx-worker.js"))
];
var TMP_ANCHOR = document.createElement("a");
var DEFAULT_URL_OPTIONS = {
  mimeType: void 0,
  mipmaps: true,
  colorSpace: "linear"
};
function resolveMimeType(filename, mimeType) {
  if (mimeType && mimeType != "application/octet-stream") {
    return mimeType;
  }
  if (filename) {
    const extIndex = filename.lastIndexOf(".");
    const extension = extIndex > -1 ? filename.substring(extIndex + 1).toLowerCase() : "none";
    mimeType = EXTENSION_MIME_TYPES[extension];
    if (!mimeType) {
      throw new Error(`Could not predict MIME type from filename "${filename}" with extension of "${extension}".`);
    }
  }
  return mimeType;
}
__name(resolveMimeType, "resolveMimeType");
function getMimeTypeLoader(handlers, mimeType) {
  if (!mimeType) {
    throw new Error("A valid MIME type must be specified.");
  }
  let typeHandler = handlers[mimeType];
  if (!typeHandler) {
    typeHandler = handlers["*"];
  }
  const loader = typeHandler.getLoader();
  if (!loader) {
    throw new Error(`Failed to get loader for MIME type "${mimeType}"`);
  }
  return loader;
}
__name(getMimeTypeLoader, "getMimeTypeLoader");
var CachingClient = class {
  static {
    __name(this, "CachingClient");
  }
  #client;
  #imageCache;
  constructor(client, imageCache) {
    this.#client = client;
    this.#imageCache = new CacheHelper(imageCache);
  }
  async loadFromCache(uri, textureOptions) {
    const image = await this.#imageCache.getMulti(uri);
    if (image) {
      const metadata = image.metadata;
      if (metadata["type"] === "imageBitmap") {
        return this.#client.fromImageBitmapBlob(image.blob, metadata["format"], textureOptions);
      } else {
        const textureData = {
          ...metadata,
          arrayBuffer: image.arrayBuffer
        };
        return this.#client.fromTextureData(textureData, textureOptions);
      }
    }
    throw new Error("Image not in Cache");
  }
  supportedFormats() {
    return this.#client.supportedFormats();
  }
  fromImageBitmapBlob(blob, format, options) {
    if (options.cacheUrl) {
      const metadata = {
        type: "imageBitmap",
        format
      };
      this.#imageCache.setMulti(options.cacheUrl, {
        metadata,
        blob
      });
    }
    return this.#client.fromImageBitmapBlob(blob, format, options);
  }
  fromTextureData(textureData, options) {
    if (options.cacheUrl) {
      const metadata = {
        type: "textureData",
        format: textureData.format
      };
      this.#imageCache.setMulti(options.cacheUrl, {
        metadata,
        arrayBuffer: textureData.arrayBuffer
      });
    }
    return this.#client.fromTextureData(textureData, options);
  }
  destroy() {
    this.#client.destroy();
  }
};
var TextureLoaderBase = class {
  static {
    __name(this, "TextureLoaderBase");
  }
  #client;
  #cachingClient;
  #handlers = {};
  /**
   * Must not be called by applications directly.
   * Create an instance of WebGPUTextureLoader instead.
   *
   * @param {object} client - The TextureClient which will upload the texture data to the GPU.
   */
  constructor(client, imageCache) {
    if (imageCache) {
      this.#client = this.#cachingClient = new CachingClient(client, imageCache);
    } else {
      this.#client = client;
    }
    for (const extensionHandler of EXTENSION_HANDLERS) {
      for (const mimeType of extensionHandler.mimeTypes) {
        this.#handlers[mimeType] = extensionHandler;
      }
    }
    this.#handlers["*"] = EXTENSION_HANDLERS[0];
  }
  get isCaching() {
    return this.#cachingClient != null;
  }
  /** Loads a texture from the given URL
   *
   * @param url - URL of the file to load.
   * @param textureOptions - Options for how the loaded texture should be handled.
   * @returns Promise which resolves to the completed WebTextureResult.
   */
  async fromUrl(url, textureOptions = {}) {
    if (!this.#client) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    TMP_ANCHOR.href = url;
    if (this.#cachingClient) {
      try {
        const cachedTexture = await this.#cachingClient.loadFromCache(TMP_ANCHOR.href, textureOptions);
        if (cachedTexture) {
          return cachedTexture;
        }
      } catch {
      }
    }
    textureOptions.cacheUrl = TMP_ANCHOR.href;
    textureOptions.filename = TMP_ANCHOR.href;
    const response = await fetch(TMP_ANCHOR.href);
    const blob = await response.blob();
    return this.fromBlob(blob, textureOptions);
  }
  /** Loads a texture from the given blob
   *
   * @param blob - Blob containing the texture file data.
   * @param textureOptions - Options for how the loaded texture should be handled.
   * @returns Promise which resolves to the completed WebTextureResult.
   */
  async fromBlob(blob, textureOptions = {}) {
    if (!this.#client) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    const options = Object.assign({}, DEFAULT_URL_OPTIONS, textureOptions);
    const mimeType = resolveMimeType(options.filename, options.mimeType ?? blob.type);
    const loader = getMimeTypeLoader(this.#handlers, mimeType);
    return loader.fromBlob(this.#client, blob, options);
  }
  /** Loads a texture from the given blob
   *
   * @param buffer - Buffer containing the texture file data.
   * @param textureOptions - Options for how the loaded texture should be handled.
   * @returns Promise which resolves to the completed WebTextureResult.
   */
  async fromBuffer(buffer, textureOptions = {}) {
    if (!this.#client) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    const options = Object.assign({}, DEFAULT_URL_OPTIONS, textureOptions);
    const mimeType = resolveMimeType(options.filename, options.mimeType);
    const loader = getMimeTypeLoader(this.#handlers, mimeType);
    return loader.fromBuffer(this.#client, buffer, options);
  }
  /**
   * Creates a 1x1 texture with the specified color.
   *
   * @param r - Red channel value
   * @param g - Green channel value
   * @param b - Blue channel value
   * @param a - Alpha channel value
   * @param format - Format to create the texture with
   * @returns Completed WebTextureResult
   */
  fromColor(r, g, b, a = 1, format = "rgba8unorm") {
    if (!this.#client) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    if (format != "rgba8unorm" && format != "rgba8unorm-srgb") {
      throw new Error('fromColor only supports "rgba8unorm" and "rgba8unorm-srgb" formats');
    }
    const data = new Uint8Array([r * 255, g * 255, b * 255, a * 255]);
    return this.#client.fromTextureData(new BasicTextureData(format, 1, 1, data), false);
  }
  /**
   * Creates a noise texture with the specified dimensions. (rgba8unorm format)
   *
   * @param width - Width of the noise texture
   * @param height - Height of the noise texture
   * @returns Completed WebTextureResult
   */
  fromNoise(width, height) {
    if (!this.#client) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    const data = new Uint8Array(width * height * 4);
    for (let i = 0; i < data.length; ++i) {
      data[i] = Math.random() * 255;
    }
    return this.#client.fromTextureData(new BasicTextureData("rgba8unorm", width, height, data), false);
  }
  /**
   * Destroys the texture tool and stops any in-progress texture loads that have been started.
   */
  destroy() {
    if (this.#client) {
      this.#client.destroy();
      this.#client = void 0;
    }
  }
};

// src/loaders/texture/webgpu-texture-loader.ts
var EXTENSION_FORMATS = {
  "texture-compression-bc": [
    "bc1-rgba-unorm",
    "bc2-rgba-unorm",
    "bc3-rgba-unorm",
    "bc7-rgba-unorm"
  ],
  "texture-compression-etc2": [
    "etc2-rgb8unorm",
    "etc2-rgb8a1unorm",
    "etc2-rgba8unorm",
    "eac-r11unorm",
    "eac-r11snorm",
    "eac-rg11unorm",
    "eac-rg11snorm"
  ],
  "texture-compression-astc": [
    "astc-4x4-unorm",
    "astc-5x4-unorm",
    "astc-5x5-unorm",
    "astc-6x5-unorm",
    "astc-6x6-unorm",
    "astc-8x5-unorm",
    "astc-8x6-unorm",
    "astc-8x8-unorm",
    "astc-10x5-unorm",
    "astc-10x6-unorm",
    "astc-10x8-unorm",
    "astc-10x10-unorm",
    "astc-12x10-unorm",
    "astc-12x12-unorm"
  ]
};
function formatForColorSpace(format, colorSpace) {
  switch (colorSpace) {
    case "sRGB":
      return `${format}-srgb`;
    default:
      return format;
  }
}
__name(formatForColorSpace, "formatForColorSpace");
var WebGpuTextureLoader = class extends TextureLoaderBase {
  static {
    __name(this, "WebGpuTextureLoader");
  }
  device;
  mipmapGenerator;
  /**
   * Creates a WebTextureTool instance which produces WebGPU textures.
   *
   * @param {module:External.GPUDevice} device - WebGPU device to create textures with.
   */
  constructor(device, imageCache) {
    const mipmapGenerator = new WebGPUMipmapGenerator(device);
    super(new WebGpuTextureClient(device, mipmapGenerator), imageCache);
    this.device = device;
    this.mipmapGenerator = mipmapGenerator;
  }
};
var WebGpuTextureClient = class {
  static {
    __name(this, "WebGpuTextureClient");
  }
  device;
  mipmapGenerator;
  supportedFormatList = [
    "rgba8unorm",
    "bgra8unorm",
    "rg11b10ufloat"
  ];
  /**
   * Creates a TextureClient instance which uses WebGPU.
   * Should not be called outside of the WebGPUTextureLoader constructor.
   *
   * @param device - WebGPU device to use.
   */
  constructor(device, mipmapGenerator) {
    this.device = device;
    this.mipmapGenerator = mipmapGenerator;
    const featureList = device.features;
    if (featureList) {
      for (const feature in EXTENSION_FORMATS) {
        if (featureList.has(feature)) {
          const formats = EXTENSION_FORMATS[feature];
          this.supportedFormatList.push(...formats);
        }
      }
    }
  }
  /**
   * Returns a list of the WebTextureFormats that this client can support.
   *
   * @returns {Array<module:WebTextureTool.WebTextureFormat>} - List of supported WebTextureFormats.
   */
  supportedFormats() {
    return this.supportedFormatList;
  }
  /**
   * Creates a GPUTexture from the given ImageBitmap.
   *
   * @param imageBitmap - ImageBitmap source for the texture.
   * @param format - Format to store the texture as on the GPU. Must be an
   * uncompressed format.
   * @param generateMipmaps - True if mipmaps are desired.
   * @returns Completed texture and metadata.
   */
  async fromImageBitmapBlob(blob, format, options) {
    if (!this.device) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    const imageBitmap = await createImageBitmap(blob);
    const generateMipmaps = options.mipmaps;
    const mipLevelCount = generateMipmaps ? WebGPUMipmapGenerator.calculateMipLevels(imageBitmap.width, imageBitmap.height) : 1;
    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
    const textureDescriptor = {
      size: { width: imageBitmap.width, height: imageBitmap.height },
      format: formatForColorSpace(format, options.colorSpace),
      usage,
      mipLevelCount
    };
    const texture = this.device.createTexture(textureDescriptor);
    this.device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, textureDescriptor.size);
    if (generateMipmaps) {
      this.mipmapGenerator.generateMipmap(texture);
    }
    return texture;
  }
  /**
   * Creates a GPUTexture from the given texture level data.
   *
   * @param textureData - Object containing data and layout for each image and
   * mip level of the texture.
   * @param generateMipmaps - True if mipmaps generation is desired. Only applies if a single level is given
   * and the texture format is renderable.
   * @returns Completed texture and metadata.
   */
  fromTextureData(textureData, options) {
    if (!this.device) {
      throw new Error("Cannot create new textures after object has been destroyed.");
    }
    const wtFormat = WebTextureFormats[textureData.format];
    if (!wtFormat) {
      throw new Error(`Unknown format "${textureData.format}"`);
    }
    const blockInfo = wtFormat.compressed || { blockBytes: 4, blockWidth: 1, blockHeight: 1 };
    const generateMipmaps = options.mipmaps && wtFormat.canGenerateMipmaps;
    const mipLevelCount = textureData.mipLevelCount > 1 ? textureData.mipLevelCount : generateMipmaps ? WebGPUMipmapGenerator.calculateMipLevels(textureData.width, textureData.height) : 1;
    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
    const textureDescriptor = {
      size: {
        width: Math.ceil(textureData.size.width / blockInfo.blockWidth) * blockInfo.blockWidth,
        height: Math.ceil(textureData.size.height / blockInfo.blockHeight) * blockInfo.blockHeight,
        depthOrArrayLayers: textureData.size.depthOrArrayLayers
      },
      format: formatForColorSpace(textureData.format, options.colorSpace),
      usage,
      mipLevelCount
    };
    const texture = this.device.createTexture(textureDescriptor);
    for (const bufferView of textureData.bufferViews) {
      const bytesPerRow = Math.ceil(bufferView.levelSize.width / blockInfo.blockWidth) * blockInfo.blockBytes;
      this.device.queue.writeTexture(
        {
          texture,
          mipLevel: bufferView.level,
          origin: { z: bufferView.layer }
        },
        textureData.arrayBuffer,
        {
          offset: bufferView.byteOffset,
          bytesPerRow
        },
        {
          // Copy width and height must be a multiple of the format block size;
          width: Math.ceil(bufferView.levelSize.width / blockInfo.blockWidth) * blockInfo.blockWidth,
          height: Math.ceil(bufferView.levelSize.height / blockInfo.blockHeight) * blockInfo.blockHeight
        }
      );
    }
    if (generateMipmaps) {
      this.mipmapGenerator.generateMipmap(texture);
    }
    return texture;
  }
  /**
   * Destroy this client.
   * The client is unusable after calling destroy().
   *
   * @returns {void}
   */
  destroy() {
    this.device = void 0;
  }
};

// src/core/camera.ts
var Camera = class {
  static {
    __name(this, "Camera");
  }
  zNear = 1;
  zFar = 1024;
  constructor(init) {
    this.zNear = init.zNear ?? this.zNear;
    this.zFar = init.zFar ?? this.zFar;
  }
  getProjection(projectionMat) {
    throw new Error("Must be overriden in inherited Camera type");
  }
};
var PerspectiveCamera = class extends Camera {
  static {
    __name(this, "PerspectiveCamera");
  }
  static SharedComponent = true;
  // Projection Matrix values
  fieldOfView = Math.PI * 0.5;
  // 90 deg
  aspect = 1;
  constructor(init = {}) {
    super(init);
    this.fieldOfView = init.fieldOfView ?? this.fieldOfView;
    this.zNear = init.zNear ?? this.zNear;
    this.zFar = init.zFar ?? this.zFar;
    this.aspect = init.aspect ?? this.aspect;
  }
  getProjection(projectionMat) {
    projectionMat.perspectiveZO(this.fieldOfView, this.aspect, this.zFar, this.zNear);
  }
};
var OrthographicCamera = class extends Camera {
  static {
    __name(this, "OrthographicCamera");
  }
  static SharedComponent = true;
  // Ortho Matrix values
  left = -1;
  right = 1;
  bottom = -1;
  top = 1;
  constructor(init = {}) {
    super(init);
    this.left = init.left ?? this.left;
    this.right = init.right ?? this.right;
    this.bottom = init.bottom ?? this.bottom;
    this.top = init.top ?? this.top;
    this.zNear = init.zNear ?? this.zNear;
    this.zFar = init.zFar ?? this.zFar;
  }
  getProjection(projectionMat) {
    projectionMat.orthoZO(this.left, this.right, this.bottom, this.top, this.zFar, this.zNear);
  }
};

// src/renderer/pipeline-factory.ts
var Pipeline = class {
  static {
    __name(this, "Pipeline");
  }
  #requestedAt;
  #requestCount = 1;
  #key;
  #pipeline;
  #promise;
  #resolved = false;
  constructor(key, pipelinePromise, defaultPipeline) {
    this.#key = key;
    this.#requestedAt = performance.now();
    if (pipelinePromise instanceof Promise) {
      if (!defaultPipeline) {
        throw new Error("Must provide a default pipeline when supplying a pipeline promise.");
      }
      this.#pipeline = defaultPipeline;
      this.#promise = pipelinePromise;
      pipelinePromise.then((pipeline) => {
        this.pipeline = pipeline;
      });
    } else {
      this.#pipeline = pipelinePromise;
      this.#resolved = true;
      this.#promise = Promise.resolve(this.pipeline);
    }
  }
  get promise() {
    return this.#promise;
  }
  get key() {
    return this.#key;
  }
  set pipeline(value) {
    if (this.#resolved) {
      return;
    }
    this.#pipeline = value;
    this.#resolved = true;
  }
  get pipeline() {
    return this.#pipeline;
  }
  get resolved() {
    return this.#resolved;
  }
  get requestedAt() {
    return this.#requestedAt;
  }
  get requestCount() {
    return this.#requestCount;
  }
  incrementRequestCount() {
    this.#requestCount++;
  }
};
var RenderPipeline = class extends Pipeline {
  static {
    __name(this, "RenderPipeline");
  }
  use(renderPass) {
    renderPass.setPipeline(this.pipeline);
  }
};
var DEFAULT_RENDER_PIPELINES = /* @__PURE__ */ new WeakMap();
function getDefaultRenderPipeline(device, attachmentLayout) {
  let devicePipelines = DEFAULT_RENDER_PIPELINES.get(device);
  if (!devicePipelines) {
    devicePipelines = /* @__PURE__ */ new Map();
    DEFAULT_RENDER_PIPELINES.set(device, devicePipelines);
  }
  let pipeline = devicePipelines.get(attachmentLayout.id);
  if (!pipeline) {
    let outStruct = "struct OutColors { ";
    for (let i = 0; i < attachmentLayout.colorFormats.length; ++i) {
      const outType = attachmentLayout.colorFormats[i];
      outStruct += `@location(${i}) color_${i}: ${AttachmentLayout.DefaultOutputType(outType)}, `;
    }
    outStruct += "}";
    const module = device.createShaderModule({
      label: "Device Default Render",
      code: wgsl`
      @vertex fn vertexMain() -> @builtin(position) vec4f {
        return vec4f(0);
      }

      #if ${attachmentLayout.colorFormats.length > 0}
      ${outStruct}

      @fragment fn fragmentMain() -> OutColors {
        return OutColors();
      }
      #else
      @fragment fn fragmentMain() {}
      #endif
      `
    });
    let depthStencil = void 0;
    if (attachmentLayout.depthStencilFormat) {
      depthStencil = {
        format: attachmentLayout.depthStencilFormat,
        depthWriteEnabled: false,
        depthCompare: "never"
      };
    }
    pipeline = device.createRenderPipeline({
      label: "Device Default Render",
      layout: "auto",
      vertex: { module },
      depthStencil,
      multisample: {
        count: attachmentLayout.sampleCount
      },
      fragment: {
        module,
        targets: attachmentLayout.colorFormats.map((format) => {
          return {
            format
          };
        })
      }
    });
    devicePipelines.set(attachmentLayout.id, pipeline);
  }
  return pipeline;
}
__name(getDefaultRenderPipeline, "getDefaultRenderPipeline");
var stableStringify = /* @__PURE__ */ __name((key, value) => {
  return value instanceof Object && !(value instanceof Array) ? Object.keys(value).sort().reduce((sorted, key2) => {
    sorted[key2] = value[key2];
    return sorted;
  }, {}) : value;
}, "stableStringify");
var RenderPipelineFactory = class {
  //#precacheFactory: PipelinePrecacheFactory;
  constructor(device, config) {
    this.device = device;
    if (config) {
      this.#config = config;
      this.#config.addEventListener("changed", (event) => {
        const cache = this.#configCaches.get(config.configRevision);
        if (!cache) {
          this.#pipelineCache = /* @__PURE__ */ new Map();
          this.#configCaches.set(config.configRevision, this.#pipelineCache);
        } else {
          this.#pipelineCache = cache;
        }
      });
      this.#configCaches.set(this.#config.configRevision, this.#pipelineCache);
    }
  }
  device;
  static {
    __name(this, "RenderPipelineFactory");
  }
  #config;
  #pipelineCache = /* @__PURE__ */ new Map();
  #configCaches = /* @__PURE__ */ new Map();
  // Returning as any to avoid type errors when accessing properties
  get config() {
    return this.#config;
  }
  serializeArgs(args) {
    return JSON.stringify(args, stableStringify);
  }
  deserializeArgs(key) {
    return JSON.parse(key);
  }
  getPipeline(geometryLayout, attachmentLayout, args, forceSync = false) {
    const key = `${geometryLayout.serializeToString()};${attachmentLayout.serializeToString()};${JSON.stringify(args, stableStringify)}`;
    return this.#getPipelineWithKey(geometryLayout, attachmentLayout, args, key, forceSync);
  }
  #getPipelineWithKey(geometryLayout, attachmentLayout, args, key, forceSync = false) {
    let pipeline = this.#pipelineCache.get(key);
    if (pipeline && (pipeline.resolved || !forceSync)) {
      pipeline.incrementRequestCount();
      return pipeline;
    }
    const descriptor = this.getPipelineDescriptor(geometryLayout, attachmentLayout, args);
    if (pipeline) {
      pipeline.pipeline = this.device.createRenderPipeline(descriptor);
    } else if (!pipeline) {
      if (forceSync) {
        pipeline = new RenderPipeline(
          key,
          this.device.createRenderPipeline(descriptor)
        );
      } else {
        pipeline = new RenderPipeline(
          key,
          this.device.createRenderPipelineAsync(descriptor),
          getDefaultRenderPipeline(this.device, attachmentLayout)
        );
      }
      this.#pipelineCache.set(key, pipeline);
    }
    return pipeline;
  }
};

// src/renderer/pipelines/common.ts
var FrameBindings = (
  /* wgsl */
  `
  struct Camera {
    projection: mat4x4f,
    invProjection: mat4x4f,
    view: mat4x4f,
    viewPos: vec3f,
    time: f32,
  };

  @group(0) @binding(0) var<uniform> camera: Camera;

  struct Instance {
    model: mat4x4f,
    normal: mat3x3f,
  }
  @group(0) @binding(1) var<storage> instances: array<Instance>;
  @group(0) @binding(2) var<storage> instanceIndices: array<u32>;

  @group(0) @binding(3) var defaultSampler: sampler;
  @group(0) @binding(4) var environmentTexture: texture_cube<f32>;
`
);
var DecalFrameBindings = (
  /* wgsl */
  `
  ${FrameBindings}

  struct Decal {
    id: u32,
    textureIndex: u32,
    opacity: f32,
    highlight: u32,
    origin: vec3f,
    decalProj: mat4x4f,
  };
  struct SceneDecals {
    decalCount: u32,
    decal: array<Decal>,
  };
  @group(0) @binding(5) var<storage> decals: SceneDecals;
  @group(0) @binding(6) var decalTexture: texture_2d_array<f32>;
  @group(0) @binding(7) var causticsTexture: texture_2d<f32>;
`
);
var SRGBConversions = (
  /* wgsl */
  `
  const GAMMA = 2.2f;
  fn sRGBToLinear(srgb : vec3f) -> vec3f {
    return pow(srgb, vec3(GAMMA));
  }

  const INV_GAMMA = 1.0f / GAMMA;
  fn linearTosRGB(linear : vec3f) -> vec3f {
    return pow(linear, vec3(INV_GAMMA));
  }
`
);

// src/renderer/pipelines/unlit.ts
var UnlitPipelineFactory = class extends RenderPipelineFactory {
  static {
    __name(this, "UnlitPipelineFactory");
  }
  materialBGL;
  pipelineLayout;
  constructor(gpu) {
    const config = gpu.config.watch();
    super(gpu.device, config);
    this.materialBGL = gpu.device.createBindGroupLayout({
      label: "Unlit Material",
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {}
      }, {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }]
    });
    this.pipelineLayout = gpu.device.createPipelineLayout({
      bindGroupLayouts: [gpu.frameBGL, this.materialBGL]
    });
  }
  getPipelineDescriptor(geometryLayout, attachmentLayout, args) {
    const module = this.device.createShaderModule({
      label: "Unlit Material",
      code: wgsl`
          ${DecalFrameBindings}

          struct Material {
            baseColorFactor: vec4f,
            baseAlbedo: vec3f,
          };

          @group(1) @binding(0) var<uniform> material: Material;
          @group(1) @binding(1) var baseColorTexture: texture_2d<f32>;
          @group(1) @binding(2) var texSampler: sampler;

          ${geometryLayout.getStandardVertexInStruct()}

          struct VertexOut {
            @builtin(position) pos: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) normal: vec3f,
            @location(2) worldPos: vec4f,
          };

          @vertex
          fn vertMain(in: VertexIn, @builtin(instance_index) instanceIdx: u32) -> VertexOut {
            let instanceId = instanceIndices[instanceIdx];
            let instance = instances[instanceId];
            let worldPos = instance.model * in.position;
            let pos = camera.projection * camera.view * worldPos;
            let n = normalize(instance.normal * in.normal);
            return VertexOut(pos, in.texcoord0, n, worldPos);
          }

          ${SRGBConversions}

          const projBias = mat4x4f(
            0.5, 0, 0, 0,
            0, -0.5, 0, 0,
            0, 0, 0.5, 0,
            0.5, 0.5, 0.5, 1,
          );

          struct FragOut {
            @location(0) color: vec4f,
            @location(1) decalId: u32,
          }

          @fragment
          fn fragMain(in: VertexOut) -> FragOut {
            let baseColor = material.baseColorFactor * textureSample(baseColorTexture, texSampler, in.texCoord);

            var out: FragOut;

          #if ${args.canDecal}
            let estAlbedo = material.baseAlbedo;
            let lightEst = baseColor.rgb / estAlbedo;

            let causticsUv = (in.pos.xy / vec2f(textureDimensions(causticsTexture)));

            let causticsA = textureSample(causticsTexture, defaultSampler, causticsUv + vec2(camera.time * 0.25, 0));
            let causticsB = textureSample(causticsTexture, defaultSampler, -causticsUv - vec2(0, camera.time * 0.1));
            let caustics = (causticsA + causticsB) * 0.5;

            var decalAccumColor = vec4f(0);
            for (var i = 0u; i < decals.decalCount; i++) {
              let decalProjCoord = projBias * decals.decal[i].decalProj * in.worldPos;
              let decalUv = decalProjCoord.xyz / decalProjCoord.w;
              var decalColor = textureSample(decalTexture, defaultSampler, decalUv.xy, decals.decal[i].textureIndex);

              // TODO: Check to ensure in.normal is facing towards the decal.
              let originToPoint = decals.decal[i].origin - in.worldPos.xyz;
              let nDotO = dot(in.normal, originToPoint);

              if (nDotO > 0 && all(decalUv >= vec3f(0)) && all(decalUv <= vec3f(1))) {
                let decalAlpha = decals.decal[i].opacity * decalColor.a;
                decalAccumColor = vec4((decalAccumColor.rgb * (1.0 - decalAlpha)) + (decalColor.rgb * decalAlpha), decalAccumColor.a + decalAlpha);

                if (decals.decal[i].highlight == 1) {
                  decalAccumColor += caustics * decalAlpha;
                }

                decalAccumColor.a = min(decalAccumColor.a, 1);

                if (decalAlpha > 0.2) {
                  out.decalId = decals.decal[i].id;
                }
              }
            }

            let color = (baseColor.rgb * (1.0 - decalAccumColor.a)) + ((decalAccumColor.rgb * lightEst) * decalAccumColor.a);
          #else
            let color = baseColor.rgb;
          #endif
            out.color = vec4(linearTosRGB(color), baseColor.a);

            return out;
          }
        `
    });
    return {
      label: "Unlit Material",
      layout: this.pipelineLayout,
      vertex: { module, buffers: geometryLayout.buffers },
      primitive: {
        topology: geometryLayout.topology,
        cullMode: args.doubleSided ? "none" : args.mirrored ? "front" : "back"
      },
      depthStencil: {
        format: attachmentLayout.depthStencilFormat,
        depthWriteEnabled: true,
        depthCompare: "greater"
      },
      fragment: {
        module,
        targets: attachmentLayout.colorFormats.map((format, index) => {
          const target = {
            format
          };
          if (args.transparent) {
            if (index == 0) {
              target.blend = {
                color: {
                  srcFactor: "src-alpha",
                  dstFactor: "one-minus-src-alpha"
                },
                alpha: {
                  srcFactor: "one",
                  dstFactor: "one"
                }
              };
            } else {
              target.writeMask = 0;
            }
          }
          return target;
        })
      }
    };
  }
};

// src/materials/decal.ts
var Decal = class {
  static {
    __name(this, "Decal");
  }
  static SharedComponent = true;
  emoji;
  textureIndex;
  projection = new Mat4();
  constructor(emoji, textureIndex) {
    this.emoji = emoji;
    this.textureIndex = textureIndex;
    this.projection.perspectiveZO(Math.PI / 4, 1, 0.1, 4);
  }
};

// src/renderer/emoji-renderer.ts
var EmojiRenderer = class {
  static {
    __name(this, "EmojiRenderer");
  }
  textureLoader;
  canvas;
  ctx;
  emojiFontLoaded;
  constructor(textureLoader) {
    this.textureLoader = textureLoader;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    const emojiFontPromises = [];
    document.fonts.forEach((font) => {
      if (font.family === "Noto Color Emoji") {
        emojiFontPromises.push(font.loaded);
        font.load();
      }
    });
    this.emojiFontLoaded = Promise.all(emojiFontPromises);
  }
  loadCustomEmojiImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = url;
    });
  }
  async renderEmoji(emoji, texture, layer = 0) {
    const width = this.canvas.width = texture.width;
    const height = this.canvas.height = texture.height;
    this.ctx.clearRect(0, 0, width, height);
    if (emoji.unicode) {
      await this.emojiFontLoaded;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = `${width * 0.75}px "Noto Color Emoji", sans-serif`;
      this.ctx.fillText(emoji.unicode, width * 0.5, height * 0.55, width);
    } else if (emoji.emoji.url) {
      const img = await this.loadCustomEmojiImage(emoji.emoji.url);
      const aspect = img.naturalWidth / img.naturalHeight;
      const imgWidth = aspect > 1 ? width : width * aspect;
      const imgHeight = aspect > 1 ? height / aspect : height;
      this.ctx.drawImage(img, (width - imgWidth) * 0.5, (height - imgHeight) * 0.5, imgWidth, imgHeight);
    }
    const device = this.textureLoader.device;
    device.queue.copyExternalImageToTexture({
      source: this.canvas
    }, {
      texture,
      origin: [0, 0, layer],
      premultipliedAlpha: true
    }, [texture.width, texture.height, 1]);
    this.textureLoader.mipmapGenerator.generateMipmap(texture, layer);
  }
};

// src/renderer/decal-manager.ts
var MAX_DECALS = 1024;
var MAX_DECAL_TEXTURES = 256;
var DECAL_BYTE_SIZE = Mat4.BYTE_LENGTH + Vec4.BYTE_LENGTH + Vec4.BYTE_LENGTH;
var DecalManager = class {
  static {
    __name(this, "DecalManager");
  }
  gpu;
  emojiRenderer;
  decalTextureArray;
  decalArray = new ArrayBuffer(DECAL_BYTE_SIZE * MAX_DECALS + Vec4.BYTE_LENGTH);
  decalUintArray = new Uint32Array(this.decalArray);
  decalFloatArray = new Float32Array(this.decalArray);
  decalBuffer;
  selectedDecal = 0;
  nextTextureIndex = 0;
  decalKeyMapping = /* @__PURE__ */ new Map();
  decalCache = [];
  constructor(gpu) {
    this.gpu = gpu;
    this.emojiRenderer = new EmojiRenderer(this.gpu.textureLoader);
    this.decalBuffer = gpu.device.createBuffer({
      label: "Decal",
      size: this.decalArray.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });
    const emojiSize = this.gpu.config.emojiTextureSize;
    this.decalTextureArray = gpu.device.createTexture({
      label: "Decal",
      size: [emojiSize, emojiSize, MAX_DECAL_TEXTURES],
      mipLevelCount: WebGPUMipmapGenerator.calculateMipLevels(emojiSize, emojiSize),
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
      format: "rgba8unorm-srgb"
    });
  }
  #getEmojiKey(emoji) {
    return emoji.unicode ?? emoji.emoji?.url;
  }
  async getDecal(emoji) {
    const decalKey = this.#getEmojiKey(emoji);
    let decalIndex = this.decalKeyMapping.get(decalKey);
    if (decalIndex !== void 0) {
      return this.decalCache[decalIndex];
    }
    decalIndex = this.nextTextureIndex;
    this.nextTextureIndex = (this.nextTextureIndex + 1) % MAX_DECAL_TEXTURES;
    let decal = this.decalCache[decalIndex];
    if (decal) {
      decal.textureIndex = -1;
      this.decalKeyMapping.delete(this.#getEmojiKey(decal.emoji));
    }
    await this.emojiRenderer.renderEmoji(emoji, this.decalTextureArray, decalIndex);
    decal = new Decal(emoji, decalIndex);
    this.decalCache[decalIndex] = decal;
    this.decalKeyMapping.set(decalKey, decalIndex);
    return decal;
  }
  updateDecals(stage) {
    const textureProj = new Mat4();
    let offset = 4;
    let decalCount = 0;
    stage.query(Decal).forEach((actor, decal) => {
      if (decal.textureIndex == -1) {
        actor.remove(Decal);
        return;
      }
      if (decalCount >= MAX_DECALS) {
        return;
      }
      const placing = actor.has(Tag("placing-decal"));
      const selected = decalCount + 1 == this.selectedDecal;
      Mat4.invert(textureProj, actor.worldTransform.matrix);
      Mat4.multiply(textureProj, decal.projection, textureProj);
      this.decalUintArray[offset] = decalCount + 1;
      this.decalUintArray[offset + 1] = decal.textureIndex;
      this.decalFloatArray[offset + 2] = placing ? 0.75 : 1;
      this.decalUintArray[offset + 3] = placing || selected ? 1 : 0;
      this.decalFloatArray.set(actor.worldTransform.translation, offset + 4);
      this.decalFloatArray.set(textureProj, offset + 8);
      offset += 24;
      decalCount++;
    });
    this.decalUintArray[0] = decalCount;
    this.gpu.device.queue.writeBuffer(this.decalBuffer, 0, this.decalArray, 0, DECAL_BYTE_SIZE * decalCount + Vec4.BYTE_LENGTH);
  }
};

// src/renderer/selection-manager.ts
var SelectionManager = class {
  static {
    __name(this, "SelectionManager");
  }
  gpu;
  selectionPipeline;
  selectionTexture;
  selectionBindGroupLayout;
  selectionBindGroup;
  selectionBuffer;
  selectionReadbackBuffers = [];
  immediateArray = new Uint32Array(2);
  constructor(gpu) {
    this.gpu = gpu;
    this.selectionBindGroupLayout = gpu.device.createBindGroupLayout({
      label: "Decal Selection",
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        texture: { sampleType: "uint" }
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage" }
      }]
    });
    this.selectionBuffer = gpu.device.createBuffer({
      label: "Decal Selection",
      size: Vec4.BYTE_LENGTH,
      usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE
    });
    const module = gpu.device.createShaderModule({
      label: "Decal Selection",
      code: `
        //const selectCoord = vec2u(128u, 128u);
        var<immediate> selectCoord: vec2u;

        @group(0) @binding(0) var selectionTexture: texture_2d<u32>;
        @group(0) @binding(1) var<storage, read_write> selection: u32;

        @compute @workgroup_size(1, 1, 1)
        fn computeMain() {
          selection = textureLoad(selectionTexture, selectCoord, 0).x;
        }
      `
    });
    this.selectionPipeline = gpu.device.createComputePipeline({
      label: "Decal Selection",
      layout: gpu.device.createPipelineLayout({
        bindGroupLayouts: [this.selectionBindGroupLayout],
        // @ts-expect-error TypeScript defs for immediates not available yet.
        immediateSize: Vec2.BYTE_LENGTH
      }),
      compute: {
        module
      }
    });
  }
  onResize(width, height) {
    const device = this.gpu.device;
    if (this.selectionTexture) {
      this.selectionTexture.destroy();
    }
    this.selectionTexture = device.createTexture({
      label: "Decal Selection",
      size: { width, height },
      sampleCount: this.gpu.config.sampleCount,
      format: this.gpu.config.selectionFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
    });
    this.selectionBindGroup = device.createBindGroup({
      label: "Decal Selection",
      layout: this.selectionBindGroupLayout,
      entries: [{
        binding: 0,
        resource: this.selectionTexture
      }, {
        binding: 1,
        resource: this.selectionBuffer
      }]
    });
  }
  #getSelectionReadbackBuffer() {
    if (this.selectionReadbackBuffers.length) {
      return this.selectionReadbackBuffers.pop();
    }
    const buffer = this.gpu.device.createBuffer({
      label: "Decal Selection Readback",
      size: this.selectionBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });
    return buffer;
  }
  async getDecalIdAtPoint(x, y) {
    const device = this.gpu.device;
    const readbackBuffer = this.#getSelectionReadbackBuffer();
    const commandEncoder = device.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass({});
    computePass.setPipeline(this.selectionPipeline);
    computePass.setBindGroup(0, this.selectionBindGroup);
    this.immediateArray[0] = x;
    this.immediateArray[1] = y;
    computePass.setImmediates(0, this.immediateArray);
    computePass.dispatchWorkgroups(1);
    computePass.end();
    commandEncoder.copyBufferToBuffer(this.selectionBuffer, readbackBuffer);
    device.queue.submit([commandEncoder.finish()]);
    await readbackBuffer.mapAsync(GPUMapMode.READ);
    const selectionArray = new Uint32Array(readbackBuffer.getMappedRange());
    const selection = selectionArray[0];
    readbackBuffer.unmap();
    this.selectionReadbackBuffers.push(readbackBuffer);
    return selection;
  }
};

// src/renderer/pipelines/pbr-common.ts
var SurfaceInfoStruct = `
  struct SurfaceInfo {
    worldPos: vec3f,
    fragPos: vec2f,
    V: vec3f, // normalized vector from the shading location to the eye
    N: vec3f, // surface normal in the world space
    specularColor: vec3f,
    diffuseColor: vec3f,
    metal: f32,
    rough: f32,
    f0: vec3f,
    ao: f32,
    alpha: f32,
  };
`;
var PBRFunctions = (
  /* wgsl */
  `
  const PI = ${Math.PI};
  const MIN_ROUGHNESS = 0.045;

  fn getSpecularLightColor(R: vec3f, roughness: f32) -> vec3f {
    let envLevels = f32(textureNumLevels(environmentTexture));

    let rough = envLevels * roughness * (2.0 - roughness);

    return textureSampleLevel(environmentTexture, defaultSampler, R, rough).rgb;
  }

  fn getDiffuseLightColor(N: vec3f) -> vec3f {
    let diffuseLevel = f32(textureNumLevels(environmentTexture) - 1);
    return textureSampleLevel(environmentTexture, defaultSampler, N, diffuseLevel).rgb;
  }

  fn FresnelSchlickRoughness(cosTheta: f32, F0: vec3f, roughness: f32) -> vec3f {
    return F0 + (max(vec3f(1 - roughness), F0) - F0) * pow(clamp(1 - cosTheta, 0, 1), 5);
  }

  // From https://www.unrealengine.com/en-US/blog/physically-based-shading-on-mobile
  fn envBRDFApprox(roughness: f32, NdotV: f32) -> vec2f {
    let c0 = vec4f(-1, -0.0275, -0.572, 0.022);
    let c1 = vec4f(1, 0.0425, 1.04, -0.04);
    let r = roughness * c0 + c1;
    let a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
    return vec2f(-1.04, 1.04) * a004 + r.zw;
  }

  fn pbrSurfaceColorIbl(surface: SurfaceInfo) -> vec3f {
    let NdotV = max(dot(surface.N, surface.V), 0);
    let R = reflect(-surface.V, surface.N);

    let kS = FresnelSchlickRoughness(NdotV, surface.f0, surface.rough);
    let kD = (1 - kS) * (1 - surface.metal);
    let irradiance = getDiffuseLightColor(surface.N);
    let diffuse    = vec3f(0); //irradiance * surface.diffuseColor;

    let prefilteredColor = getSpecularLightColor(R, surface.rough);
    let envBrdf = envBRDFApprox(surface.rough, NdotV);
    let specular = prefilteredColor * (surface.specularColor * envBrdf.x + envBrdf.y);

    let ambient    = (kD * diffuse + specular) * surface.ao;
    return ambient;
  }
`
);

// src/renderer/pipelines/pbr.ts
var PBRPipelineFactory = class extends RenderPipelineFactory {
  static {
    __name(this, "PBRPipelineFactory");
  }
  materialBGL;
  pipelineLayout;
  constructor(gpu) {
    const config = gpu.config.watch();
    super(gpu.device, config);
    this.materialBGL = gpu.device.createBindGroupLayout({
      label: "PBR Material",
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {}
      }, {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }, {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 5,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }, {
        binding: 6,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }]
    });
    this.pipelineLayout = gpu.device.createPipelineLayout({
      bindGroupLayouts: [gpu.frameBGL, this.materialBGL]
    });
  }
  getPipelineDescriptor(geometryLayout, attachmentLayout, args) {
    const module = this.device.createShaderModule({
      label: "PBR Material",
      code: wgsl`
          ${FrameBindings}

          struct Material {
            baseColorFactor: vec4f,
            metallicRoughnessFactor: vec2f,
            emissiveFactor: vec4f,
          };

          @group(1) @binding(0) var<uniform> material: Material;
          @group(1) @binding(1) var materialSampler: sampler;
          @group(1) @binding(2) var baseColorTexture: texture_2d<f32>;
          @group(1) @binding(3) var normalTexture: texture_2d<f32>;
          @group(1) @binding(4) var metallicRoughnessTexture: texture_2d<f32>;
          @group(1) @binding(5) var occlusionTexture: texture_2d<f32>;
          @group(1) @binding(6) var emissiveTexture: texture_2d<f32>;

          ${geometryLayout.getStandardVertexInStruct()}

          struct VertexOut {
            @builtin(position) pos: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) normal: vec3f,
            @location(2) worldPos: vec4f,
            @location(3) color: vec4f,
          #if ${geometryLayout.locationsUsed.has(AttribLocation.tangent)}
            @location(4) tangent: vec3f,
            @location(5) bitangent: vec3f,
          #endif
          };

          @vertex
          fn vertMain(in: VertexIn, @builtin(instance_index) instanceIdx: u32) -> VertexOut {
            let instanceId = instanceIndices[instanceIdx];
            let instance = instances[instanceId];

            var out: VertexOut;

            out.worldPos = instance.model * in.position;
            out.pos = camera.projection * camera.view * out.worldPos;
            out.texCoord = in.texcoord0;
            out.normal = normalize(instance.normal * in.normal);
          #if ${geometryLayout.locationsUsed.has(AttribLocation.color)}
            out.color = in.color;
          #else
            out.color = vec4f(1);
          #endif
          #if ${geometryLayout.locationsUsed.has(AttribLocation.tangent)}
            out.tangent = normalize(instance.normal * in.tangent.xyz);
            out.bitangent = cross(out.normal, out.tangent) * in.tangent.w;
          #endif

            return out;
          }

          ${SRGBConversions}

          ${SurfaceInfoStruct}

          ${PBRFunctions}

          struct FragOut {
            @location(0) color: vec4f,
            @location(1) decalId: u32,
          }

          @fragment
          fn fragMain(in: VertexOut) -> FragOut {

            var surface: SurfaceInfo;
            surface.worldPos = in.worldPos.xyz;
            surface.fragPos = in.pos.xy;
            surface.V = normalize(camera.viewPos - surface.worldPos);

          #if ${geometryLayout.locationsUsed.has(AttribLocation.tangent)}
            let tbn = mat3x3f(in.tangent, in.bitangent, in.normal);
            let texNormal = textureSample(normalTexture, materialSampler, in.texCoord).rgb;
            surface.N = normalize(tbn * (texNormal * 2 - 1));
          #else
            surface.N = normalize(in.normal);
          #endif

            let environment = textureSample(environmentTexture, materialSampler, surface.N);

            let baseColor = material.baseColorFactor * textureSample(baseColorTexture, materialSampler, in.texCoord);
            surface.alpha = baseColor.a;
            let color = in.color.rgb * baseColor.rgb;

            let metalRough = material.metallicRoughnessFactor * textureSample(metallicRoughnessTexture, materialSampler, in.texCoord).bg;
            surface.metal = metalRough.r;
            surface.rough = clamp(metalRough.g, MIN_ROUGHNESS, 1.0);

            surface.diffuseColor = color * (1 - surface.metal);
            surface.specularColor = color * surface.metal;

            let dielectricSpec = vec3f(0.04);
            surface.f0 = mix(dielectricSpec, color.rgb, vec3f(surface.metal));

            surface.ao = textureSample(occlusionTexture, materialSampler, in.texCoord).r;

            let emmisive = material.emissiveFactor.rgb * textureSample(emissiveTexture, materialSampler, in.texCoord).rgb;

            var Lo = pbrSurfaceColorIbl(surface);

            // Punctual lights would go here.

            Lo += (surface.diffuseColor * surface.ao) + emmisive;

            var out: FragOut;
            out.decalId = 0;
            out.color = vec4(linearTosRGB(Lo), surface.alpha);
            return out;
          }
        `
    });
    return {
      label: "PBR Material",
      layout: this.pipelineLayout,
      vertex: { module, buffers: geometryLayout.buffers },
      primitive: {
        topology: geometryLayout.topology,
        cullMode: args.doubleSided ? "none" : args.mirrored ? "front" : "back"
      },
      depthStencil: {
        format: attachmentLayout.depthStencilFormat,
        depthWriteEnabled: true,
        depthCompare: "greater"
      },
      fragment: {
        module,
        targets: attachmentLayout.colorFormats.map((format, index) => {
          const target = {
            format
          };
          if (args.transparent) {
            if (index == 0) {
              target.blend = {
                color: {
                  srcFactor: "src-alpha",
                  dstFactor: "one-minus-src-alpha"
                },
                alpha: {
                  srcFactor: "one",
                  dstFactor: "one"
                }
              };
            } else {
              target.writeMask = 0;
            }
          }
          return target;
        })
      }
    };
  }
};

// src/materials/pbr.ts
var PBRMaterial = class extends MaterialBase {
  static {
    __name(this, "PBRMaterial");
  }
  static SharedComponent = true;
  uniformBuffer;
  materialBindGroup;
  label;
  transparent;
  doubleSided;
  baseColorFactor;
  baseColorTexture;
  normalTexture;
  metallicFactor;
  roughnessFactor;
  metallicRoughnessTexture;
  occlusionTexture;
  emissiveFactor;
  emissiveTexture;
  constructor(gpu, desc) {
    super();
    this.label = desc?.label;
    this.transparent = desc?.transparent ?? false;
    this.doubleSided = desc?.doubleSided ?? false;
    this.baseColorFactor = new Vec4(desc?.baseColorFactor ?? [1, 1, 1, 1]);
    this.baseColorTexture = desc?.baseColorTexture ?? gpu.whiteTexture;
    this.normalTexture = desc?.normalTexture ?? gpu.normalTexture;
    this.metallicFactor = desc?.metallicFactor ?? 0;
    this.roughnessFactor = desc?.roughnessFactor ?? 1;
    this.metallicRoughnessTexture = desc?.metallicRoughnessTexture ?? gpu.whiteTexture;
    this.occlusionTexture = desc?.occlusionTexture ?? gpu.whiteTexture;
    ;
    this.emissiveFactor = new Vec3(desc?.emissiveFactor ?? [1, 1, 1]);
    this.emissiveTexture = desc?.emissiveTexture ?? gpu.blackTexture;
    this.uniformBuffer = gpu.device.createBuffer({
      label: "PBR Material",
      size: Vec4.BYTE_LENGTH * 4,
      usage: GPUBufferUsage.UNIFORM,
      mappedAtCreation: true
    });
    this.materialBindGroup = gpu.device.createBindGroup({
      label: "PBR Material",
      layout: gpu.pbrPipelineFactory.materialBGL,
      entries: [{
        binding: 0,
        resource: this.uniformBuffer
      }, {
        binding: 1,
        resource: gpu.defaultSampler
      }, {
        binding: 2,
        resource: this.baseColorTexture
      }, {
        binding: 3,
        resource: this.normalTexture
      }, {
        binding: 4,
        resource: this.metallicRoughnessTexture
      }, {
        binding: 5,
        resource: this.occlusionTexture
      }, {
        binding: 6,
        resource: this.emissiveTexture
      }]
    });
    const mapped = new Float32Array(this.uniformBuffer.getMappedRange());
    mapped.set(this.baseColorFactor, 0);
    mapped[4] = this.metallicFactor;
    mapped[5] = this.roughnessFactor;
    mapped.set(this.emissiveFactor, 8);
    this.uniformBuffer.unmap();
    Object.freeze(this);
  }
};

// src/renderer/webgpu-renderer.ts
var WebGPURenderer = class {
  static {
    __name(this, "WebGPURenderer");
  }
  device;
  canvas;
  context;
  config;
  textureLoader;
  depthStencilTexture;
  msaaColorTexture;
  attachmentLayout;
  #cameraArray = new Float32Array(16 * 3 + 4);
  #projMat = new Mat4(this.#cameraArray.buffer, 0);
  #inverseProjMat = new Mat4(this.#cameraArray.buffer, Mat4.BYTE_LENGTH);
  #viewMat = new Mat4(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 2);
  #viewPos = new Vec3(this.#cameraArray.buffer, Mat4.BYTE_LENGTH * 3);
  frameBGL;
  frameBindGroup;
  cameraBuffer;
  instanceManager;
  decalManager;
  selectionManager;
  unlitPipelineFactory;
  pbrPipelineFactory;
  defaultSampler;
  whiteTexture;
  blackTexture;
  normalTexture;
  whiteCubeTexture;
  #environmentTexture;
  causticsTexture;
  constructor(device, options) {
    this.device = device;
    this.canvas = options.canvas ?? document.createElement("canvas");
    this.context = this.canvas.getContext("webgpu");
    this.config = Config.Create(RenderConfig, device);
    this.context.configure({
      device: this.device,
      format: this.config.colorFormat
    });
    this.textureLoader = new WebGpuTextureLoader(device);
    this.whiteTexture = this.textureLoader.fromColor(1, 1, 1, 1);
    this.blackTexture = this.textureLoader.fromColor(0, 0, 0, 0);
    this.normalTexture = this.textureLoader.fromColor(0.5, 0.5, 1, 1);
    this.textureLoader.fromUrl("./media/textures/caustics.jpg").then((texture) => {
      this.causticsTexture = texture;
      this.frameBindingsDirty();
    });
    this.whiteCubeTexture = this.device.createTexture({
      label: "Temp Environment",
      size: [1, 1, 6],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING
    });
    this.attachmentLayout = new AttachmentLayout(
      [this.config.colorFormat, this.config.selectionFormat],
      this.config.depthStencilFormat,
      this.config.sampleCount
    );
    this.cameraBuffer = device.createBuffer({
      label: "Camera",
      size: this.#cameraArray.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.frameBGL = device.createBindGroupLayout({
      label: "Frame",
      entries: [{
        // Camera Uniforms
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {}
      }, {
        // Instance Data
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage" }
      }, {
        // Instance Index
        binding: 2,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage" }
      }, {
        // Default Sampler
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }, {
        // Environment Texture
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { viewDimension: "cube" }
      }, {
        // Decal Data
        binding: 5,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: "read-only-storage" }
      }, {
        // Decal Array Texture
        binding: 6,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { viewDimension: "2d-array" }
      }, {
        // Caustics Texture
        binding: 7,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {}
      }]
    });
    this.defaultSampler = device.createSampler({
      label: "Default",
      addressModeU: "repeat",
      addressModeV: "repeat",
      minFilter: "linear",
      magFilter: "linear",
      mipmapFilter: "linear"
    });
    this.decalManager = new DecalManager(this);
    this.selectionManager = new SelectionManager(this);
    this.instanceManager = new InstanceManager(this);
    this.unlitPipelineFactory = new UnlitPipelineFactory(this);
    this.pbrPipelineFactory = new PBRPipelineFactory(this);
  }
  get environmentTexture() {
    return this.#environmentTexture;
  }
  set environmentTexture(value) {
    this.#environmentTexture = value;
    this.frameBindingsDirty();
  }
  onResize(width, height) {
    width = Math.floor(width * this.config.outputScale);
    height = Math.floor(height * this.config.outputScale);
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.depthStencilTexture) {
      this.depthStencilTexture.destroy();
    }
    this.depthStencilTexture = this.device.createTexture({
      label: "WebGPURenderer depthStencil",
      size: { width, height },
      sampleCount: this.config.sampleCount,
      format: this.config.depthStencilFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    if (this.config.sampleCount > 1) {
      if (this.msaaColorTexture) {
        this.msaaColorTexture.destroy();
      }
      this.msaaColorTexture = this.device.createTexture({
        label: "WebGPURenderer msaaColor",
        size: { width, height },
        sampleCount: this.config.sampleCount,
        format: this.config.colorFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      });
    }
    this.selectionManager.onResize(width, height);
  }
  #rebuildFrameBindings = true;
  frameBindingsDirty() {
    this.#rebuildFrameBindings = true;
  }
  #ensureFrameBindings() {
    if (this.#rebuildFrameBindings) {
      this.#rebuildFrameBindings = false;
      this.frameBindGroup = this.device.createBindGroup({
        label: "Frame",
        layout: this.frameBGL,
        entries: [{
          binding: 0,
          resource: this.cameraBuffer
        }, {
          binding: 1,
          resource: this.instanceManager.instanceBuffers.instanceTransformBuffer
        }, {
          binding: 2,
          resource: this.instanceManager.instanceBuffers.instanceIndexBuffer
        }, {
          binding: 3,
          resource: this.defaultSampler
        }, {
          binding: 4,
          resource: (this.environmentTexture ? this.environmentTexture : this.whiteCubeTexture).createView({ dimension: "cube" })
        }, {
          binding: 5,
          resource: this.decalManager.decalBuffer
        }, {
          binding: 6,
          resource: this.decalManager.decalTextureArray.createView({
            label: "Decal",
            dimension: "2d-array"
          })
        }, {
          binding: 7,
          resource: this.causticsTexture ?? this.whiteTexture
        }]
      });
    }
    return this.frameBindGroup;
  }
  #updateCamera(cameraActor, timestamp) {
    const camera = cameraActor.get(PerspectiveCamera) ?? cameraActor.get(OrthographicCamera);
    if (!camera) {
      throw new Error("cameraActor passed to WebGPURenderer.render() must have a camera component");
    }
    camera.getProjection(this.#projMat);
    Mat4.invert(this.#inverseProjMat, this.#projMat);
    Mat4.invert(this.#viewMat, cameraActor.worldTransform.matrix);
    this.#viewPos.set(cameraActor.worldTransform.translation);
    this.#cameraArray[51] = timestamp / 1e3;
    this.device.queue.writeBuffer(this.cameraBuffer, 0, this.#cameraArray);
  }
  render(stage, cameraActor, timestamp = performance.now()) {
    this.#updateCamera(cameraActor, timestamp);
    this.instanceManager.updateInstances(stage);
    this.decalManager.updateDecals(stage);
    if (this.instanceManager.instanceCount == 0) {
      return;
    }
    const colorTexture = this.context.getCurrentTexture();
    const commandEncoder = this.device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: colorTexture,
        loadOp: "clear",
        clearValue: [0.1, 0.1, 0.2, 1],
        storeOp: "store"
      }, {
        view: this.selectionManager.selectionTexture,
        loadOp: "clear",
        clearValue: [0, 0, 0, 0],
        storeOp: "store"
      }],
      depthStencilAttachment: {
        view: this.depthStencilTexture,
        depthLoadOp: "clear",
        depthClearValue: 0,
        depthStoreOp: "discard"
      }
    });
    renderPass.setBindGroup(0, this.#ensureFrameBindings());
    for (let materialGeometries of this.instanceManager.materials.values()) {
      if (materialGeometries.material instanceof UnlitMaterial) {
        renderPass.setBindGroup(1, materialGeometries.material.materialBindGroup);
        for (let geometryInstances of materialGeometries.geometries.values()) {
          if (geometryInstances.instances.length) {
            const pipeline = this.unlitPipelineFactory.getPipeline(
              geometryInstances.geometry.layout,
              this.attachmentLayout,
              { ...materialGeometries.material, mirrored: false }
            );
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
          if (geometryInstances.mirroredInstances.length) {
            const pipeline = this.unlitPipelineFactory.getPipeline(
              geometryInstances.geometry.layout,
              this.attachmentLayout,
              { ...materialGeometries.material, mirrored: true }
            );
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.mirroredInstanceCount, geometryInstances.mirroredIndexOffset);
          }
        }
      } else if (materialGeometries.material instanceof PBRMaterial) {
        renderPass.setBindGroup(1, materialGeometries.material.materialBindGroup);
        for (let geometryInstances of materialGeometries.geometries.values()) {
          if (geometryInstances.instances.length) {
            const pipeline = this.pbrPipelineFactory.getPipeline(
              geometryInstances.geometry.layout,
              this.attachmentLayout,
              { ...materialGeometries.material, mirrored: false }
            );
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.instanceCount, geometryInstances.indexOffset);
          }
          if (geometryInstances.mirroredInstances.length) {
            const pipeline = this.pbrPipelineFactory.getPipeline(
              geometryInstances.geometry.layout,
              this.attachmentLayout,
              { ...materialGeometries.material, mirrored: true }
            );
            pipeline.use(renderPass);
            geometryInstances.geometry.bindAndDraw(renderPass, geometryInstances.mirroredInstanceCount, geometryInstances.mirroredIndexOffset);
          }
        }
      }
    }
    renderPass.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
};
var ResizeHandler = class {
  static {
    __name(this, "ResizeHandler");
  }
  static #observer;
  static #elementCallbacks;
  static observe(element, callback) {
    if (!this.#observer) {
      this.#elementCallbacks = /* @__PURE__ */ new WeakMap();
      this.#observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const element2 = entry.target;
          const callback2 = this.#elementCallbacks.get(element2);
          if (!callback2) {
            continue;
          }
          if (entry.devicePixelContentBoxSize) {
            callback2(
              entry.devicePixelContentBoxSize[0].inlineSize,
              entry.devicePixelContentBoxSize[0].blockSize,
              element2
            );
          } else {
            callback2(
              entry.contentBoxSize[0].inlineSize * devicePixelRatio,
              entry.contentBoxSize[0].blockSize * devicePixelRatio,
              element2
            );
          }
        }
      });
    }
    if (element.clientWidth != 0 && element.clientHeight != 0) {
      callback(
        Math.floor(element.clientWidth * devicePixelRatio),
        Math.floor(element.clientHeight * devicePixelRatio),
        element
      );
    }
    this.#elementCallbacks.set(element, callback);
    this.#observer.observe(element);
  }
  static unobserve(element) {
    this.#observer?.unobserve(element);
    this.#elementCallbacks?.delete(element);
  }
};
var WebGPUApp = class {
  constructor(gpu) {
    this.gpu = gpu;
  }
  gpu;
  static {
    __name(this, "WebGPUApp");
  }
  static async Begin(appType, options = {}) {
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
      console.log("Unable to create WebGPU device.");
      return;
    }
    const gpu = new WebGPURenderer(device, options);
    const app = new appType(gpu);
    await app.onInit(gpu);
    ResizeHandler.observe(gpu.canvas, (width, height) => {
      gpu.onResize(width, height);
      app.onResize(gpu, width, height);
    });
    let lastFrame = performance.now();
    const rafCallback = /* @__PURE__ */ __name((timestamp) => {
      requestAnimationFrame(rafCallback);
      const delta = timestamp - lastFrame;
      lastFrame = timestamp;
      if (delta > 1e3) {
        return;
      }
      app.onFrame(gpu, timestamp, delta);
    }, "rafCallback");
    requestAnimationFrame(rafCallback);
  }
  async onInit(gpu) {
  }
  onResize(gpu, width, height) {
  }
  onFrame(gpu, timestamp, delta) {
  }
};

// src/app-config.ts
var AppConfig = class _AppConfig extends Config {
  static {
    __name(this, "AppConfig");
  }
  emoji;
  sprayCooldown = 500;
  static SetDefaults(isMobile) {
    const defaults = isMobile ? new MobileAppConfig() : new _AppConfig();
    defaults.emoji = {
      emoji: { name: "Firefox Logo", shortcodes: Array(1), url: "./media/emoji/firefox.svg" },
      name: "Firefox Logo",
      skinTone: 0
    };
    return defaults;
  }
};
var MobileAppConfig = class extends AppConfig {
  static {
    __name(this, "MobileAppConfig");
  }
  emojiTextureSize = 128;
};

// src/loaders/gltf/gltf-state.ts
var GL = WebGLRenderingContext;
var absUriRegEx = new RegExp(`^${window.location.protocol}`, "i");
var dataUriRegEx = /^data:/;
function isDataUri(uri) {
  return !!uri.match(dataUriRegEx);
}
__name(isDataUri, "isDataUri");
function resolveUri(uri, baseUrl) {
  if (!!uri.match(absUriRegEx) || !!uri.match(dataUriRegEx)) {
    return uri;
  }
  return baseUrl + uri;
}
__name(resolveUri, "resolveUri");
var DEFAULT_TRANSLATION2 = [0, 0, 0];
var DEFAULT_ROTATION2 = [0, 0, 0, 1];
var DEFAULT_SCALE2 = [1, 1, 1];
function componentCountForType(type) {
  switch (type) {
    case "SCALAR":
      return 1;
    case "VEC2":
      return 2;
    case "VEC3":
      return 3;
    case "VEC4":
      return 4;
    case "MAT2":
      return 4;
    case "MAT3":
      return 9;
    case "MAT4":
      return 16;
    default:
      return 0;
  }
}
__name(componentCountForType, "componentCountForType");
function byteSizeForComponentType(componentType) {
  switch (componentType) {
    case GL.BYTE:
      return 1;
    case GL.UNSIGNED_BYTE:
      return 1;
    case GL.SHORT:
      return 2;
    case GL.UNSIGNED_SHORT:
      return 2;
    case GL.UNSIGNED_INT:
      return 4;
    case GL.FLOAT:
      return 4;
    default:
      return 0;
  }
}
__name(byteSizeForComponentType, "byteSizeForComponentType");
function accessorPackedByeStride(accessor) {
  return byteSizeForComponentType(accessor.componentType) * componentCountForType(accessor.type);
}
__name(accessorPackedByeStride, "accessorPackedByeStride");
var GltfState = class {
  static {
    __name(this, "GltfState");
  }
  gpu;
  gltf;
  url;
  baseUrl;
  filename;
  options;
  stats;
  scene = new Actor();
  #bufferViewByteArrays = [];
  #imageTextures = [];
  #samplers = [];
  #materials = [];
  #meshes = [];
  #shapes = [];
  constructor(gpu, userOptions, url) {
    this.gpu = gpu;
    this.stats = {
      startTime: performance.now(),
      fetchTime: 0,
      fetchCount: 0,
      transforms: {}
    };
    this.options = structuredClone(userOptions);
    this.url = url ?? userOptions.url;
    if (this.url === void 0) {
      throw new Error(`A url must be specified.`);
    }
    const filenameIdx = this.url.lastIndexOf("/");
    this.filename = this.url.substring(filenameIdx + 1);
    this.baseUrl = userOptions.baseUrl;
    if (this.baseUrl === void 0) {
      if (filenameIdx === -1) {
        throw new Error(`A baseUrl must be specified or derived from the url.`);
      }
      this.baseUrl = this.url.substring(0, filenameIdx + 1);
    }
  }
  init(gltf, binaryChunk) {
    this.gltf = gltf;
    const asset = gltf.asset;
    if (!asset) {
      throw new Error("Missing asset description.");
    }
    if (asset.minVersion != "2.0" && asset.version != "2.0") {
      throw new Error("Incompatible asset version.");
    }
    this.#setDefaults();
    this.#loadBuffers(binaryChunk);
    this.#loadImages();
    this.#loadSamplers();
    this.#loadMaterials();
    this.#loadMeshes();
    this.#loadImplicitShapes();
  }
  getBufferViewByteArray(index) {
    return this.#bufferViewByteArrays[index];
  }
  getImageTexture(index) {
    return this.#imageTextures[index];
  }
  getSampler(index) {
    return this.#samplers[index];
  }
  getMaterial(index) {
    return this.#materials[index];
  }
  getMesh(index) {
    return this.#meshes[index];
  }
  setExtras(obj, extras) {
    if (obj.extras === void 0) {
      obj.extras = extras;
    } else {
      Object.assign(obj.extras, extras);
    }
  }
  // Primes the gltf structure with defaults from the spec where data isn't specified
  #setDefaults() {
    const gltf = this.gltf;
    gltf.extensionsRequired = gltf.extensionsRequired ?? [];
    gltf.extensionsUsed = gltf.extensionsUsed ?? [];
    gltf.samplers = gltf.samplers ?? [];
    gltf.images = gltf.images ?? [];
    gltf.textures = gltf.textures ?? [];
    gltf.materials = gltf.materials ?? [];
    if (gltf.scenes) {
      gltf.scene = gltf.scene ?? 0;
    }
    for (const accessor of gltf.accessors ?? []) {
      accessor.byteOffset = accessor.byteOffset ?? 0;
      accessor.normalized = accessor.normalized ?? false;
      this.setExtras(accessor, {
        componentCount: componentCountForType(accessor.type),
        packedByteStride: accessorPackedByeStride(accessor)
      });
    }
    let defaultSampler = -1;
    for (const texture of gltf.textures ?? []) {
      if (texture.sampler === void 0) {
        if (defaultSampler === -1) {
          defaultSampler = gltf.samplers.length;
          gltf.samplers.push({ name: "Default Sampler" });
        }
        texture.sampler = defaultSampler;
      }
    }
    for (const sampler of gltf.samplers ?? []) {
      sampler.wrapS = sampler.wrapS ?? GL.REPEAT;
      sampler.wrapT = sampler.wrapT ?? GL.REPEAT;
      sampler.magFilter = sampler.magFilter ?? GL.LINEAR;
      sampler.minFilter = sampler.minFilter ?? GL.LINEAR_MIPMAP_LINEAR;
    }
    let defaultMaterial = -1;
    if (gltf.meshes) {
      for (const index in gltf.meshes) {
        const mesh = gltf.meshes[index];
        for (const primitiveIndex in mesh.primitives) {
          const primitive = mesh.primitives[primitiveIndex];
          for (const accessorIndex of Object.values(primitive.attributes)) {
            const accessor = gltf.accessors[accessorIndex];
            this.setExtras(accessor, { target: GL.ARRAY_BUFFER });
          }
          if ("indices" in primitive) {
            const accessor = gltf.accessors[primitive.indices];
            this.setExtras(accessor, { target: GL.ELEMENT_ARRAY_BUFFER });
          }
          primitive.mode = primitive.mode ?? GL.TRIANGLES;
          if (primitive.material === void 0) {
            if (defaultMaterial < 0) {
              defaultMaterial = gltf.materials.length;
              gltf.materials.push({ name: "Default Material" });
            }
            primitive.material = defaultMaterial;
          }
        }
      }
    }
    for (const material of gltf.materials) {
      material.emissiveFactor = material.emissiveFactor ?? [0, 0, 0];
      material.alphaMode = material.alphaMode ?? "OPAQUE";
      material.alphaCutoff = material.alphaCutoff ?? 0.5;
      material.doubleSided = material.doubleSided ?? false;
      const pbr = material.pbrMetallicRoughness;
      if (pbr) {
        pbr.baseColorFactor = pbr.baseColorFactor ?? [1, 1, 1, 1];
        pbr.metallicFactor = pbr.metallicFactor ?? 1;
        pbr.roughnessFactor = pbr.roughnessFactor ?? 1;
        if (pbr.normalTexture) {
          pbr.normalTexture.scale = pbr.normalTexture.scale ?? 1;
        }
        if (pbr.occlusionTexture) {
          pbr.occlusionTexture.strength = pbr.occlusionTexture.strength ?? 1;
        }
      }
    }
    for (const node of gltf.nodes ?? []) {
      if (!node.matrix) {
        node.rotation = node.rotation ?? DEFAULT_ROTATION2;
        node.scale = node.scale ?? DEFAULT_SCALE2;
        node.translation = node.translation ?? DEFAULT_TRANSLATION2;
      }
    }
    if (this.gltf.extras === void 0) {
      this.gltf.extras = {};
    }
    this.gltf.extras.url = this.url;
  }
  #loadBuffers(binaryChunk) {
    const gltf = this.gltf;
    const buffers = [];
    if (binaryChunk) {
      buffers[0] = Promise.resolve(binaryChunk);
    } else {
      if (gltf.buffers) {
        for (let bufferIndex = 0; bufferIndex < gltf.buffers.length; bufferIndex++) {
          const buffer = gltf.buffers[bufferIndex];
          if (!buffer.uri) {
            continue;
          }
          const uri = resolveUri(buffer.uri, this.baseUrl);
          buffers[bufferIndex] = fetch(uri).then((response) => {
            return response.arrayBuffer();
          });
        }
      }
    }
    if (gltf.bufferViews) {
      for (let bufferViewIndex = 0; bufferViewIndex < gltf.bufferViews.length; bufferViewIndex++) {
        const bufferView = gltf.bufferViews[bufferViewIndex];
        this.#bufferViewByteArrays[bufferViewIndex] = buffers[bufferView.buffer].then((arrayBuffer) => {
          if (bufferView.byteLength === void 0) {
            bufferView.byteLength = arrayBuffer.byteLength - bufferView.byteOffset;
          }
          return new Uint8Array(arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
        });
      }
    }
  }
  // Loads all images as WebGPU textures
  #loadImages() {
    const gltf = this.gltf;
    if (!gltf.images) {
      return;
    }
    const annotateImages = /* @__PURE__ */ __name(() => {
      const gltf2 = this.gltf;
      const SRGB_TEXTURE_SLOTS = ["baseColorTexture", "diffuseTexture", "emissiveTexture"];
      if (!gltf2.materials?.length) {
        return;
      }
      const materialsSlotsByImage = /* @__PURE__ */ new Map();
      const markSource = /* @__PURE__ */ __name((source, key) => {
        if (source === void 0) {
          return;
        }
        const image = gltf2.images[source];
        let materialSlots = materialsSlotsByImage.get(image);
        if (!materialSlots) {
          materialSlots = [key];
          materialsSlotsByImage.set(image, materialSlots);
        } else {
          materialSlots.push(key);
        }
        if (SRGB_TEXTURE_SLOTS.indexOf(key) !== -1) {
          this.setExtras(image, { sRgb: true });
        }
      }, "markSource");
      const annotateMaterial = /* @__PURE__ */ __name((materialProperties) => {
        if (!materialProperties) {
          return;
        }
        for (const [key, value] of Object.entries(materialProperties)) {
          if (key.endsWith("Texture")) {
            const texture = gltf2.textures[value.index];
            markSource(texture.source, key);
            markSource(texture.extensions?.KHR_texture_basisu?.source, key);
          } else if (key !== "extras" && typeof value === "object") {
            annotateMaterial(value);
          }
        }
      }, "annotateMaterial");
      for (const material of gltf2.materials) {
        annotateMaterial(material);
      }
      for (const image of gltf2.images) {
        const materialSlots = materialsSlotsByImage.get(image) ?? [];
        this.setExtras(image, { materialSlots });
      }
    }, "annotateImages");
    const loadImage = /* @__PURE__ */ __name(async (index) => {
      const image = gltf.images[index];
      let textureOptions = { colorSpace: image.extras.sRgb ? "sRGB" : "linear" };
      let blob;
      if (image.uri) {
        const uri = resolveUri(image.uri, this.baseUrl);
        if (!isDataUri(uri)) {
          this.#imageTextures[index] = this.gpu.textureLoader.fromUrl(uri, textureOptions);
        }
        const response = await fetch(uri);
        blob = await response.blob();
      } else if (image.bufferView !== void 0) {
        const byteArray = await this.getBufferViewByteArray(image.bufferView);
        blob = new Blob([byteArray], { type: image.mimeType });
      } else {
        console.warn(`Gltf Image[${index}] did not have a uri or buffer view. Returning default texture.`);
        return this.gpu.textureLoader.fromColor(1, 0, 1, 1);
      }
      return this.gpu.textureLoader.fromBlob(blob, textureOptions);
    }, "loadImage");
    annotateImages();
    for (let i = 0; i < gltf.images.length; ++i) {
      this.#imageTextures[i] = loadImage(i);
    }
  }
  #loadSamplers() {
    const gltf = this.gltf;
    if (!gltf.samplers) {
      return;
    }
    function wrapToAddressMode(wrap) {
      switch (wrap) {
        case GL.CLAMP_TO_EDGE:
          return "clamp-to-edge";
        case GL.MIRRORED_REPEAT:
          return "mirror-repeat";
        default:
          return "repeat";
      }
    }
    __name(wrapToAddressMode, "wrapToAddressMode");
    for (const [index, sampler] of gltf.samplers.entries()) {
      const descriptor = {
        addressModeU: wrapToAddressMode(sampler.wrapS),
        addressModeV: wrapToAddressMode(sampler.wrapT)
      };
      switch (sampler.magFilter) {
        case GL.NEAREST:
          break;
        default:
          descriptor.magFilter = "linear";
          break;
      }
      switch (sampler.minFilter) {
        case GL.NEAREST:
          break;
        case GL.LINEAR:
        case GL.LINEAR_MIPMAP_NEAREST:
          descriptor.minFilter = "linear";
          break;
        case GL.NEAREST_MIPMAP_LINEAR:
          descriptor.mipmapFilter = "linear";
          break;
        default:
          descriptor.minFilter = "linear";
          descriptor.mipmapFilter = "linear";
          break;
      }
      this.#samplers[index] = this.gpu.device.createSampler(descriptor);
    }
  }
  #loadMaterials() {
    const gltf = this.gltf;
    if (!gltf.materials) {
      return;
    }
    const buildMaterial = /* @__PURE__ */ __name(async (material) => {
      const getTexture = /* @__PURE__ */ __name(async (textureInfo) => {
        if (textureInfo === void 0) {
          return void 0;
        }
        const texture = gltf.textures[textureInfo.index];
        let imageIndex = texture.source;
        if (texture.extensions?.KHR_texture_basisu) {
          imageIndex = texture.extensions.KHR_texture_basisu.source;
        }
        return this.getImageTexture(imageIndex);
      }, "getTexture");
      if (material.extensions?.KHR_materials_unlit !== void 0) {
        return new UnlitMaterial(this.gpu, {
          label: material.name,
          doubleSided: material.doubleSided,
          baseColorFactor: material.pbrMetallicRoughness?.baseColorFactor,
          baseColorTexture: await getTexture(material.pbrMetallicRoughness?.baseColorTexture),
          baseAlbedo: material.extras?.baseColor,
          canDecal: material.extras?.canDecal
        });
      }
      return new PBRMaterial(this.gpu, {
        label: material.name,
        doubleSided: material.doubleSided,
        baseColorFactor: material.pbrMetallicRoughness?.baseColorFactor,
        baseColorTexture: await getTexture(material.pbrMetallicRoughness?.baseColorTexture),
        normalTexture: await getTexture(material.normalTexture),
        metallicFactor: material.pbrMetallicRoughness?.metallicFactor,
        roughnessFactor: material.pbrMetallicRoughness?.roughnessFactor,
        metallicRoughnessTexture: await getTexture(material.pbrMetallicRoughness?.metallicRoughnessTexture),
        emissiveFactor: material.emissiveFactor,
        emissiveTexture: await getTexture(material.emissiveTexture),
        occlusionTexture: await getTexture(material.occlusionTexture)
      });
    }, "buildMaterial");
    for (const [index, material] of gltf.materials.entries()) {
      this.#materials[index] = buildMaterial(material);
    }
  }
  #loadMeshes() {
    const gltf = this.gltf;
    if (!gltf.meshes) {
      return;
    }
    function gpuFormatForAccessor(accessor) {
      const norm = accessor.normalized ? "norm" : "int";
      const count = accessor.extras.componentCount;
      let x = count > 1 ? `x${count}` : "";
      switch (accessor.componentType) {
        case GL.BYTE:
          return `s${norm}8${x}`;
        case GL.UNSIGNED_BYTE:
          return `u${norm}8${x}`;
        case GL.SHORT:
          return `s${norm}16${x}`;
        case GL.UNSIGNED_SHORT:
          return `u${norm}16${x}`;
        case GL.UNSIGNED_INT:
          return `u${norm}32${x}`;
        case GL.FLOAT:
          return `float32${x}`;
        default:
          throw new Error(`Unsupported vertex format: ${accessor.componentType}`);
      }
    }
    __name(gpuFormatForAccessor, "gpuFormatForAccessor");
    function gpuPrimitiveTopologyForMode(mode) {
      switch (mode) {
        case void 0:
        case GL.TRIANGLES:
          return "triangle-list";
        case GL.TRIANGLE_STRIP:
          return "triangle-strip";
        case GL.LINES:
          return "line-list";
        case GL.LINE_STRIP:
          return "line-strip";
        case GL.POINTS:
          return "point-list";
        default:
          throw new Error(`Unsupported Primitive Topology: ${mode}`);
      }
    }
    __name(gpuPrimitiveTopologyForMode, "gpuPrimitiveTopologyForMode");
    const buildGeometryDescriptor = /* @__PURE__ */ __name(async (primitive) => {
      const descriptor = {
        topology: gpuPrimitiveTopologyForMode(primitive.mode)
      };
      for (const [attribName, accessorIndex] of Object.entries(primitive.attributes)) {
        const accessor = gltf.accessors[accessorIndex];
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const attributeDescriptor = {
          values: await this.getBufferViewByteArray(accessor.bufferView),
          offset: accessor.byteOffset,
          stride: bufferView.byteStride || accessor.extras.packedByteStride,
          format: gpuFormatForAccessor(accessor)
        };
        switch (attribName) {
          case "POSITION":
            descriptor.position = attributeDescriptor;
            break;
          case "NORMAL":
            descriptor.normal = attributeDescriptor;
            break;
          case "TANGENT":
            descriptor.tangent = attributeDescriptor;
            break;
          case "TEXCOORD_0":
            descriptor.texcoord0 = attributeDescriptor;
            break;
          case "TEXCOORD_1":
            descriptor.texcoord1 = attributeDescriptor;
            break;
          case "COLOR_0":
            descriptor.color = attributeDescriptor;
            break;
          case "JOINTS_0":
            descriptor.joints = attributeDescriptor;
            break;
          case "WEIGHTS_0":
            descriptor.weights = attributeDescriptor;
            break;
          default:
            continue;
        }
        descriptor.drawCount = accessor.count;
      }
      if (primitive.indices !== void 0) {
        const accessor = gltf.accessors[primitive.indices];
        const indexBytes = await this.getBufferViewByteArray(accessor.bufferView);
        const byteOffset = (accessor.byteOffset ?? 0) + indexBytes.byteOffset;
        let indexCount = accessor.count;
        switch (accessor.componentType) {
          case GL.UNSIGNED_SHORT:
            indexCount = Math.min(indexBytes.byteLength / 2, indexCount);
            descriptor.indices = new Uint16Array(indexBytes.buffer, byteOffset, indexCount);
            break;
          case GL.UNSIGNED_INT:
            indexCount = Math.min(indexBytes.byteLength / 4, indexCount);
            descriptor.indices = new Uint32Array(indexBytes.buffer, byteOffset, indexCount);
            break;
          default:
            throw new Error(`Unsupported index format ${accessor.componentType}`);
        }
        descriptor.drawCount = indexCount;
      }
      return descriptor;
    }, "buildGeometryDescriptor");
    const buildMesh = /* @__PURE__ */ __name(async (mesh) => {
      const descriptorPromises = [];
      const materialPromises = [];
      for (const primitive of mesh.primitives) {
        descriptorPromises.push(buildGeometryDescriptor(primitive));
        materialPromises.push(this.getMaterial(primitive.material));
      }
      const geometries = Geometry.CreateBatch(this.gpu.device, await Promise.all(descriptorPromises));
      const materials = await Promise.all(materialPromises);
      return {
        primitives: geometries.map((geometry, index) => {
          const material = materials[index];
          return { geometry, material };
        })
      };
    }, "buildMesh");
    for (const mesh of gltf.meshes) {
      this.#meshes.push(buildMesh(mesh));
    }
  }
  #loadImplicitShapes() {
    const gltf = this.gltf;
    if (!gltf.extensions?.KHR_implicit_shapes) {
      return;
    }
    const shapes = gltf.extensions.KHR_implicit_shapes?.shapes ?? [];
    for (const shape of shapes) {
      this.#shapes.push(shape);
    }
  }
};

// src/loaders/gltf/gltf-loader.ts
var GLB_MAGIC = 1179937895;
var CHUNK_TYPE = {
  JSON: 1313821514,
  BIN: 5130562
};
var GltfLoader = class {
  static {
    __name(this, "GltfLoader");
  }
  gpu;
  constructor(gpu) {
    this.gpu = gpu;
  }
  async loadFromUrl(url, userOptions = {}) {
    const state = new GltfState(this.gpu, userOptions, url);
    let extension = state.options.extension;
    if (extension === void 0) {
      const i = state.url.lastIndexOf(".");
      extension = i !== -1 ? state.url.substring(i + 1) : void 0;
    }
    switch (extension) {
      case "gltf": {
        const response = await fetch(url);
        state.stats.fetchTime = performance.now() - state.stats.startTime;
        state.stats.fetchCount = 1;
        return this.loadFromJson(await response.json(), state);
      }
      case "glb": {
        const response = await fetch(url);
        state.stats.fetchTime = performance.now() - state.stats.startTime;
        state.stats.fetchCount = 1;
        return this.loadFromBinary(await response.arrayBuffer(), state);
      }
      default:
        throw new Error(`Unrecognized file extension: ${extension}`);
    }
  }
  async loadFromBinary(arrayBuffer, userOptions = {}) {
    let state;
    if (userOptions instanceof GltfState) {
      state = userOptions;
    } else {
      state = new GltfState(this.gpu, userOptions);
    }
    const headerView = new DataView(arrayBuffer, 0, 12);
    const magic = headerView.getUint32(0, true);
    const version = headerView.getUint32(4, true);
    const length = headerView.getUint32(8, true);
    if (magic != GLB_MAGIC) {
      throw new Error(`Invalid magic value (${magic}) in binary header.`);
    }
    if (version != 2) {
      throw new Error(`Incompatible version (${version}) in binary header. Only glTF 2.0 files are supported.`);
    }
    let chunks = [];
    let chunkOffset = 12;
    while (chunkOffset < length) {
      const chunkHeaderView = new DataView(arrayBuffer, chunkOffset, 8);
      const chunkLength = chunkHeaderView.getUint32(0, true);
      const chunkType = chunkHeaderView.getUint32(4, true);
      chunks[chunkType] = arrayBuffer.slice(chunkOffset + 8, chunkOffset + 8 + chunkLength);
      chunkOffset += chunkLength + 8;
    }
    if (!chunks[CHUNK_TYPE.JSON]) {
      throw new Error("File contained no json chunk.");
    }
    const decoder = new TextDecoder("utf-8");
    const jsonString = decoder.decode(chunks[CHUNK_TYPE.JSON]);
    const gltf = JSON.parse(jsonString);
    gltf.buffers = [{
      byteLength: chunks[CHUNK_TYPE.BIN].byteLength
    }];
    return this.loadFromJson(gltf, state, chunks[CHUNK_TYPE.BIN]);
  }
  async loadFromJson(gltf, userOptions = {}, binaryChunk) {
    let state;
    if (userOptions instanceof GltfState) {
      state = userOptions;
    } else {
      state = new GltfState(this.gpu, userOptions);
    }
    state.init(gltf, binaryChunk);
    if (!gltf.scenes) {
      throw new Error(`Gltf ${state.url} does not have any scenes`);
    }
    const sceneIndex = gltf.scene ?? 0;
    const scene = gltf.scenes[sceneIndex];
    for (const nodeIndex of scene.nodes ?? []) {
      const node = gltf.nodes[nodeIndex];
      state.scene.attachChild(await this.buildNodeActor(state, node));
    }
    return state.scene;
  }
  async buildNodeActor(state, node) {
    const actor = new Actor();
    if (node.mesh !== void 0) {
      const mesh = await state.getMesh(node.mesh);
      if (mesh !== void 0) {
        if (mesh.primitives.length == 1) {
          actor.add(mesh.primitives[0].geometry);
          actor.add(mesh.primitives[0].material);
        } else {
          for (const primitive of mesh.primitives) {
            actor.attachChild(new Actor(primitive.geometry, primitive.material));
          }
        }
      }
    }
    if (node.extensions?.KHR_physics_rigid_bodies) {
      console.log("Got a physics body:", node.extensions?.KHR_physics_rigid_bodies);
    }
    if (node.matrix) {
      actor.transform.matrix = node.matrix;
    } else {
      actor.transform.rotation = node.rotation;
      actor.transform.translation = node.translation;
      actor.transform.scale = node.scale;
    }
    for (const nodeIndex of node.children ?? []) {
      const childNode = state.gltf.nodes[nodeIndex];
      actor.attachChild(await this.buildNodeActor(state, childNode));
    }
    return actor;
  }
};

// src/controllers/controller-input.ts
var ControllerInput = class {
  static {
    __name(this, "ControllerInput");
  }
  #element;
  #registerElement;
  #keyPressed = {};
  #mousePressed = [];
  constructor(element) {
    let lastX;
    let lastY;
    window.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      this.#keyPressed[event.code] = true;
    });
    window.addEventListener("keyup", (event) => {
      this.#keyPressed[event.code] = false;
    });
    window.addEventListener("blur", (event) => {
      this.#keyPressed = {};
    });
    const downCallback = /* @__PURE__ */ __name((event) => {
      lastX = event.pageX;
      lastY = event.pageY;
    }, "downCallback");
    const moveCallback = /* @__PURE__ */ __name((event) => {
      this.#mousePressed[0] = (event.buttons & 1) != 0 || event.pointerType == "touch";
      this.#mousePressed[1] = (event.buttons & 2) != 0;
      this.#mousePressed[3] = (event.buttons & 4) != 0;
      this.#mousePressed[4] = (event.buttons & 8) != 0;
      this.#mousePressed[5] = (event.buttons & 16) != 0;
      if (document.pointerLockElement !== null) {
        this.onMouseMove(event.movementX, event.movementY);
      } else {
        this.onMouseMove(event.pageX - lastX, event.pageY - lastY);
      }
      lastX = event.pageX;
      lastY = event.pageY;
    }, "moveCallback");
    const wheelCallback = /* @__PURE__ */ __name((event) => {
      this.onScroll(event.deltaY);
      event.preventDefault();
    }, "wheelCallback");
    this.#registerElement = (value) => {
      if (this.#element && this.#element != value) {
        this.#element.removeEventListener("pointerdown", downCallback);
        this.#element.removeEventListener("pointermove", moveCallback);
        this.#element.removeEventListener("wheel", wheelCallback);
      }
      this.#element = value;
      if (this.#element) {
        this.#element.addEventListener("pointerdown", downCallback);
        this.#element.addEventListener("pointermove", moveCallback);
        this.#element.addEventListener("wheel", wheelCallback);
      }
    };
    this.#registerElement(element);
  }
  set element(value) {
    this.#registerElement(value);
  }
  get element() {
    return this.#element;
  }
  onMouseMove(xDelta, yDelta) {
  }
  onScroll(delta) {
  }
  keyPressed(keycode) {
    return !!this.#keyPressed[keycode];
  }
  mousePressed(button) {
    return !!this.#mousePressed[button];
  }
};

// src/controllers/flying-controller.ts
var tmpDir = new Vec3();
var FlyingController = class extends ControllerInput {
  static {
    __name(this, "FlyingController");
  }
  speed = 0.01;
  angles = new Vec2();
  rotation = new Quat();
  constructor(element) {
    super(element);
  }
  setAngles(x, y) {
    this.angles[0] = x;
    this.angles[1] = y;
    const q = this.rotation;
    q.identity();
    Quat.rotateY(q, q, -this.angles[1]);
    Quat.rotateX(q, q, -this.angles[0]);
  }
  onMouseMove(xDelta, yDelta) {
    if (this.mousePressed(0)) {
      this.angles[1] = (this.angles[1] + xDelta * 0.025) % (Math.PI * 2);
      this.angles[0] += yDelta * 0.025;
      this.angles[0] = Math.min(Math.max(this.angles[0], -Math.PI * 0.5), Math.PI * 0.5);
      const q = this.rotation;
      q.identity();
      Quat.rotateY(q, q, -this.angles[1]);
      Quat.rotateX(q, q, -this.angles[0]);
    }
  }
  static TickOrder = 1;
  onTick(tickData, actor) {
    Vec3.set(tmpDir, 0, 0, 0);
    if (this.keyPressed("KeyW")) {
      tmpDir[2] -= 1;
    }
    if (this.keyPressed("KeyS")) {
      tmpDir[2] += 1;
    }
    if (this.keyPressed("KeyA")) {
      tmpDir[0] -= 1;
    }
    if (this.keyPressed("KeyD")) {
      tmpDir[0] += 1;
    }
    if (this.keyPressed("Space")) {
      tmpDir[1] += 1;
    }
    if (this.keyPressed("ShiftLeft")) {
      tmpDir[1] -= 1;
    }
    if (tmpDir[0] !== 0 || tmpDir[1] !== 0 || tmpDir[2] !== 0) {
      Vec3.transformQuat(tmpDir, tmpDir, this.rotation);
      Vec3.normalize(tmpDir, tmpDir);
      Vec3.scaleAndAdd(actor.transform.translationRef, actor.transform.translationRef, tmpDir, this.speed * tickData.delta);
    }
    actor.transform.rotation = this.rotation;
  }
};

// src/audio-player.ts
var AudioClip = class _AudioClip {
  static {
    __name(this, "AudioClip");
  }
  bufferPromise;
  offset = 0;
  duration;
  constructor(bufferPromise, offset, duration) {
    this.bufferPromise = bufferPromise;
    this.offset = offset ?? 0;
    this.duration = duration;
  }
  subClips(clips) {
    const audioClips = [];
    for (const clip of clips) {
      audioClips.push(new _AudioClip(this.bufferPromise, this.offset + clip.offset, clip.duration));
    }
    return audioClips;
  }
};
var AudioPlayer = class {
  static {
    __name(this, "AudioPlayer");
  }
  #context = new AudioContext();
  constructor() {
  }
  loadClip(url) {
    const buffer = fetch(url).then((res) => res.arrayBuffer()).then((ArrayBuffer2) => this.#context.decodeAudioData(ArrayBuffer2));
    return new AudioClip(buffer);
  }
  async play(clip) {
    const source = this.#context.createBufferSource();
    source.buffer = await clip.bufferPromise;
    source.connect(this.#context.destination);
    source.start(0, clip.offset, clip.duration);
  }
};

// node_modules/tweakpane/dist/tweakpane.js
function forceCast(v) {
  return v;
}
__name(forceCast, "forceCast");
function isEmpty(value) {
  return value === null || value === void 0;
}
__name(isEmpty, "isEmpty");
function isObject$1(value) {
  return value !== null && typeof value === "object";
}
__name(isObject$1, "isObject$1");
function isRecord(value) {
  return value !== null && typeof value === "object";
}
__name(isRecord, "isRecord");
function deepEqualsArray(a1, a2) {
  if (a1.length !== a2.length) {
    return false;
  }
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}
__name(deepEqualsArray, "deepEqualsArray");
function deepMerge(r1, r2) {
  const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(r1), ...Object.keys(r2)]));
  return keys.reduce((result, key) => {
    const v1 = r1[key];
    const v2 = r2[key];
    return isRecord(v1) && isRecord(v2) ? Object.assign(Object.assign({}, result), { [key]: deepMerge(v1, v2) }) : Object.assign(Object.assign({}, result), { [key]: key in r2 ? v2 : v1 });
  }, {});
}
__name(deepMerge, "deepMerge");
function isBinding(value) {
  if (!isObject$1(value)) {
    return false;
  }
  return "target" in value;
}
__name(isBinding, "isBinding");
var CREATE_MESSAGE_MAP = {
  alreadydisposed: /* @__PURE__ */ __name(() => "View has been already disposed", "alreadydisposed"),
  invalidparams: /* @__PURE__ */ __name((context) => `Invalid parameters for '${context.name}'`, "invalidparams"),
  nomatchingcontroller: /* @__PURE__ */ __name((context) => `No matching controller for '${context.key}'`, "nomatchingcontroller"),
  nomatchingview: /* @__PURE__ */ __name((context) => `No matching view for '${JSON.stringify(context.params)}'`, "nomatchingview"),
  notbindable: /* @__PURE__ */ __name(() => `Value is not bindable`, "notbindable"),
  notcompatible: /* @__PURE__ */ __name((context) => `Not compatible with  plugin '${context.id}'`, "notcompatible"),
  propertynotfound: /* @__PURE__ */ __name((context) => `Property '${context.name}' not found`, "propertynotfound"),
  shouldneverhappen: /* @__PURE__ */ __name(() => "This error should never happen", "shouldneverhappen")
};
var TpError = class _TpError {
  static {
    __name(this, "TpError");
  }
  static alreadyDisposed() {
    return new _TpError({ type: "alreadydisposed" });
  }
  static notBindable() {
    return new _TpError({
      type: "notbindable"
    });
  }
  static notCompatible(bundleId, id) {
    return new _TpError({
      type: "notcompatible",
      context: {
        id: `${bundleId}.${id}`
      }
    });
  }
  static propertyNotFound(name) {
    return new _TpError({
      type: "propertynotfound",
      context: {
        name
      }
    });
  }
  static shouldNeverHappen() {
    return new _TpError({ type: "shouldneverhappen" });
  }
  constructor(config) {
    var _a;
    this.message = (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : "Unexpected error";
    this.name = this.constructor.name;
    this.stack = new Error(this.message).stack;
    this.type = config.type;
  }
  toString() {
    return this.message;
  }
};
var BindingTarget = class _BindingTarget {
  static {
    __name(this, "BindingTarget");
  }
  constructor(obj, key) {
    this.obj_ = obj;
    this.key = key;
  }
  static isBindable(obj) {
    if (obj === null) {
      return false;
    }
    if (typeof obj !== "object" && typeof obj !== "function") {
      return false;
    }
    return true;
  }
  read() {
    return this.obj_[this.key];
  }
  write(value) {
    this.obj_[this.key] = value;
  }
  writeProperty(name, value) {
    const valueObj = this.read();
    if (!_BindingTarget.isBindable(valueObj)) {
      throw TpError.notBindable();
    }
    if (!(name in valueObj)) {
      throw TpError.propertyNotFound(name);
    }
    valueObj[name] = value;
  }
};
var Emitter = class {
  static {
    __name(this, "Emitter");
  }
  constructor() {
    this.observers_ = {};
  }
  on(eventName, handler, opt_options) {
    var _a;
    let observers = this.observers_[eventName];
    if (!observers) {
      observers = this.observers_[eventName] = [];
    }
    observers.push({
      handler,
      key: (_a = opt_options === null || opt_options === void 0 ? void 0 : opt_options.key) !== null && _a !== void 0 ? _a : handler
    });
    return this;
  }
  off(eventName, key) {
    const observers = this.observers_[eventName];
    if (observers) {
      this.observers_[eventName] = observers.filter((observer) => {
        return observer.key !== key;
      });
    }
    return this;
  }
  emit(eventName, event) {
    const observers = this.observers_[eventName];
    if (!observers) {
      return;
    }
    observers.forEach((observer) => {
      observer.handler(event);
    });
  }
};
var ComplexValue = class {
  static {
    __name(this, "ComplexValue");
  }
  constructor(initialValue, config) {
    var _a;
    this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
    this.equals_ = (_a = config === null || config === void 0 ? void 0 : config.equals) !== null && _a !== void 0 ? _a : ((v1, v2) => v1 === v2);
    this.emitter = new Emitter();
    this.rawValue_ = initialValue;
  }
  get constraint() {
    return this.constraint_;
  }
  get rawValue() {
    return this.rawValue_;
  }
  set rawValue(rawValue) {
    this.setRawValue(rawValue, {
      forceEmit: false,
      last: true
    });
  }
  setRawValue(rawValue, options) {
    const opts = options !== null && options !== void 0 ? options : {
      forceEmit: false,
      last: true
    };
    const constrainedValue = this.constraint_ ? this.constraint_.constrain(rawValue) : rawValue;
    const prevValue = this.rawValue_;
    const changed = !this.equals_(prevValue, constrainedValue);
    if (!changed && !opts.forceEmit) {
      return;
    }
    this.emitter.emit("beforechange", {
      sender: this
    });
    this.rawValue_ = constrainedValue;
    this.emitter.emit("change", {
      options: opts,
      previousRawValue: prevValue,
      rawValue: constrainedValue,
      sender: this
    });
  }
};
var PrimitiveValue = class {
  static {
    __name(this, "PrimitiveValue");
  }
  constructor(initialValue) {
    this.emitter = new Emitter();
    this.value_ = initialValue;
  }
  get rawValue() {
    return this.value_;
  }
  set rawValue(value) {
    this.setRawValue(value, {
      forceEmit: false,
      last: true
    });
  }
  setRawValue(value, options) {
    const opts = options !== null && options !== void 0 ? options : {
      forceEmit: false,
      last: true
    };
    const prevValue = this.value_;
    if (prevValue === value && !opts.forceEmit) {
      return;
    }
    this.emitter.emit("beforechange", {
      sender: this
    });
    this.value_ = value;
    this.emitter.emit("change", {
      options: opts,
      previousRawValue: prevValue,
      rawValue: this.value_,
      sender: this
    });
  }
};
var ReadonlyPrimitiveValue = class {
  static {
    __name(this, "ReadonlyPrimitiveValue");
  }
  constructor(value) {
    this.emitter = new Emitter();
    this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.value_ = value;
    this.value_.emitter.on("beforechange", this.onValueBeforeChange_);
    this.value_.emitter.on("change", this.onValueChange_);
  }
  get rawValue() {
    return this.value_.rawValue;
  }
  onValueBeforeChange_(ev) {
    this.emitter.emit("beforechange", Object.assign(Object.assign({}, ev), { sender: this }));
  }
  onValueChange_(ev) {
    this.emitter.emit("change", Object.assign(Object.assign({}, ev), { sender: this }));
  }
};
function createValue(initialValue, config) {
  const constraint = config === null || config === void 0 ? void 0 : config.constraint;
  const equals = config === null || config === void 0 ? void 0 : config.equals;
  if (!constraint && !equals) {
    return new PrimitiveValue(initialValue);
  }
  return new ComplexValue(initialValue, config);
}
__name(createValue, "createValue");
function createReadonlyValue(value) {
  return [
    new ReadonlyPrimitiveValue(value),
    (rawValue, options) => {
      value.setRawValue(rawValue, options);
    }
  ];
}
__name(createReadonlyValue, "createReadonlyValue");
var ValueMap = class _ValueMap {
  static {
    __name(this, "ValueMap");
  }
  constructor(valueMap) {
    this.emitter = new Emitter();
    this.valMap_ = valueMap;
    for (const key in this.valMap_) {
      const v = this.valMap_[key];
      v.emitter.on("change", () => {
        this.emitter.emit("change", {
          key,
          sender: this
        });
      });
    }
  }
  static createCore(initialValue) {
    const keys = Object.keys(initialValue);
    return keys.reduce((o, key) => {
      return Object.assign(o, {
        [key]: createValue(initialValue[key])
      });
    }, {});
  }
  static fromObject(initialValue) {
    const core = this.createCore(initialValue);
    return new _ValueMap(core);
  }
  get(key) {
    return this.valMap_[key].rawValue;
  }
  set(key, value) {
    this.valMap_[key].rawValue = value;
  }
  value(key) {
    return this.valMap_[key];
  }
};
var DefiniteRangeConstraint = class {
  static {
    __name(this, "DefiniteRangeConstraint");
  }
  constructor(config) {
    this.values = ValueMap.fromObject({
      max: config.max,
      min: config.min
    });
  }
  constrain(value) {
    const max = this.values.get("max");
    const min = this.values.get("min");
    return Math.min(Math.max(value, min), max);
  }
};
var RangeConstraint = class {
  static {
    __name(this, "RangeConstraint");
  }
  constructor(config) {
    this.values = ValueMap.fromObject({
      max: config.max,
      min: config.min
    });
  }
  constrain(value) {
    const max = this.values.get("max");
    const min = this.values.get("min");
    let result = value;
    if (!isEmpty(min)) {
      result = Math.max(result, min);
    }
    if (!isEmpty(max)) {
      result = Math.min(result, max);
    }
    return result;
  }
};
var StepConstraint = class {
  static {
    __name(this, "StepConstraint");
  }
  constructor(step, origin = 0) {
    this.step = step;
    this.origin = origin;
  }
  constrain(value) {
    const o = this.origin % this.step;
    const r = Math.round((value - o) / this.step);
    return o + r * this.step;
  }
};
var NumberLiteralNode = class {
  static {
    __name(this, "NumberLiteralNode");
  }
  constructor(text) {
    this.text = text;
  }
  evaluate() {
    return Number(this.text);
  }
  toString() {
    return this.text;
  }
};
var BINARY_OPERATION_MAP = {
  "**": /* @__PURE__ */ __name((v1, v2) => Math.pow(v1, v2), "**"),
  "*": /* @__PURE__ */ __name((v1, v2) => v1 * v2, "*"),
  "/": /* @__PURE__ */ __name((v1, v2) => v1 / v2, "/"),
  "%": /* @__PURE__ */ __name((v1, v2) => v1 % v2, "%"),
  "+": /* @__PURE__ */ __name((v1, v2) => v1 + v2, "+"),
  "-": /* @__PURE__ */ __name((v1, v2) => v1 - v2, "-"),
  "<<": /* @__PURE__ */ __name((v1, v2) => v1 << v2, "<<"),
  ">>": /* @__PURE__ */ __name((v1, v2) => v1 >> v2, ">>"),
  ">>>": /* @__PURE__ */ __name((v1, v2) => v1 >>> v2, ">>>"),
  "&": /* @__PURE__ */ __name((v1, v2) => v1 & v2, "&"),
  "^": /* @__PURE__ */ __name((v1, v2) => v1 ^ v2, "^"),
  "|": /* @__PURE__ */ __name((v1, v2) => v1 | v2, "|")
};
var BinaryOperationNode = class {
  static {
    __name(this, "BinaryOperationNode");
  }
  constructor(operator, left, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  evaluate() {
    const op = BINARY_OPERATION_MAP[this.operator];
    if (!op) {
      throw new Error(`unexpected binary operator: '${this.operator}`);
    }
    return op(this.left.evaluate(), this.right.evaluate());
  }
  toString() {
    return [
      "b(",
      this.left.toString(),
      this.operator,
      this.right.toString(),
      ")"
    ].join(" ");
  }
};
var UNARY_OPERATION_MAP = {
  "+": /* @__PURE__ */ __name((v) => v, "+"),
  "-": /* @__PURE__ */ __name((v) => -v, "-"),
  "~": /* @__PURE__ */ __name((v) => ~v, "~")
};
var UnaryOperationNode = class {
  static {
    __name(this, "UnaryOperationNode");
  }
  constructor(operator, expr) {
    this.operator = operator;
    this.expression = expr;
  }
  evaluate() {
    const op = UNARY_OPERATION_MAP[this.operator];
    if (!op) {
      throw new Error(`unexpected unary operator: '${this.operator}`);
    }
    return op(this.expression.evaluate());
  }
  toString() {
    return ["u(", this.operator, this.expression.toString(), ")"].join(" ");
  }
};
function combineReader(parsers) {
  return (text, cursor) => {
    for (let i = 0; i < parsers.length; i++) {
      const result = parsers[i](text, cursor);
      if (result !== "") {
        return result;
      }
    }
    return "";
  };
}
__name(combineReader, "combineReader");
function readWhitespace(text, cursor) {
  var _a;
  const m = text.substr(cursor).match(/^\s+/);
  return (_a = m && m[0]) !== null && _a !== void 0 ? _a : "";
}
__name(readWhitespace, "readWhitespace");
function readNonZeroDigit(text, cursor) {
  const ch = text.substr(cursor, 1);
  return ch.match(/^[1-9]$/) ? ch : "";
}
__name(readNonZeroDigit, "readNonZeroDigit");
function readDecimalDigits(text, cursor) {
  var _a;
  const m = text.substr(cursor).match(/^[0-9]+/);
  return (_a = m && m[0]) !== null && _a !== void 0 ? _a : "";
}
__name(readDecimalDigits, "readDecimalDigits");
function readSignedInteger(text, cursor) {
  const ds = readDecimalDigits(text, cursor);
  if (ds !== "") {
    return ds;
  }
  const sign = text.substr(cursor, 1);
  cursor += 1;
  if (sign !== "-" && sign !== "+") {
    return "";
  }
  const sds = readDecimalDigits(text, cursor);
  if (sds === "") {
    return "";
  }
  return sign + sds;
}
__name(readSignedInteger, "readSignedInteger");
function readExponentPart(text, cursor) {
  const e = text.substr(cursor, 1);
  cursor += 1;
  if (e.toLowerCase() !== "e") {
    return "";
  }
  const si = readSignedInteger(text, cursor);
  if (si === "") {
    return "";
  }
  return e + si;
}
__name(readExponentPart, "readExponentPart");
function readDecimalIntegerLiteral(text, cursor) {
  const ch = text.substr(cursor, 1);
  if (ch === "0") {
    return ch;
  }
  const nzd = readNonZeroDigit(text, cursor);
  cursor += nzd.length;
  if (nzd === "") {
    return "";
  }
  return nzd + readDecimalDigits(text, cursor);
}
__name(readDecimalIntegerLiteral, "readDecimalIntegerLiteral");
function readDecimalLiteral1(text, cursor) {
  const dil = readDecimalIntegerLiteral(text, cursor);
  cursor += dil.length;
  if (dil === "") {
    return "";
  }
  const dot = text.substr(cursor, 1);
  cursor += dot.length;
  if (dot !== ".") {
    return "";
  }
  const dds = readDecimalDigits(text, cursor);
  cursor += dds.length;
  return dil + dot + dds + readExponentPart(text, cursor);
}
__name(readDecimalLiteral1, "readDecimalLiteral1");
function readDecimalLiteral2(text, cursor) {
  const dot = text.substr(cursor, 1);
  cursor += dot.length;
  if (dot !== ".") {
    return "";
  }
  const dds = readDecimalDigits(text, cursor);
  cursor += dds.length;
  if (dds === "") {
    return "";
  }
  return dot + dds + readExponentPart(text, cursor);
}
__name(readDecimalLiteral2, "readDecimalLiteral2");
function readDecimalLiteral3(text, cursor) {
  const dil = readDecimalIntegerLiteral(text, cursor);
  cursor += dil.length;
  if (dil === "") {
    return "";
  }
  return dil + readExponentPart(text, cursor);
}
__name(readDecimalLiteral3, "readDecimalLiteral3");
var readDecimalLiteral = combineReader([
  readDecimalLiteral1,
  readDecimalLiteral2,
  readDecimalLiteral3
]);
function parseBinaryDigits(text, cursor) {
  var _a;
  const m = text.substr(cursor).match(/^[01]+/);
  return (_a = m && m[0]) !== null && _a !== void 0 ? _a : "";
}
__name(parseBinaryDigits, "parseBinaryDigits");
function readBinaryIntegerLiteral(text, cursor) {
  const prefix = text.substr(cursor, 2);
  cursor += prefix.length;
  if (prefix.toLowerCase() !== "0b") {
    return "";
  }
  const bds = parseBinaryDigits(text, cursor);
  if (bds === "") {
    return "";
  }
  return prefix + bds;
}
__name(readBinaryIntegerLiteral, "readBinaryIntegerLiteral");
function readOctalDigits(text, cursor) {
  var _a;
  const m = text.substr(cursor).match(/^[0-7]+/);
  return (_a = m && m[0]) !== null && _a !== void 0 ? _a : "";
}
__name(readOctalDigits, "readOctalDigits");
function readOctalIntegerLiteral(text, cursor) {
  const prefix = text.substr(cursor, 2);
  cursor += prefix.length;
  if (prefix.toLowerCase() !== "0o") {
    return "";
  }
  const ods = readOctalDigits(text, cursor);
  if (ods === "") {
    return "";
  }
  return prefix + ods;
}
__name(readOctalIntegerLiteral, "readOctalIntegerLiteral");
function readHexDigits(text, cursor) {
  var _a;
  const m = text.substr(cursor).match(/^[0-9a-f]+/i);
  return (_a = m && m[0]) !== null && _a !== void 0 ? _a : "";
}
__name(readHexDigits, "readHexDigits");
function readHexIntegerLiteral(text, cursor) {
  const prefix = text.substr(cursor, 2);
  cursor += prefix.length;
  if (prefix.toLowerCase() !== "0x") {
    return "";
  }
  const hds = readHexDigits(text, cursor);
  if (hds === "") {
    return "";
  }
  return prefix + hds;
}
__name(readHexIntegerLiteral, "readHexIntegerLiteral");
var readNonDecimalIntegerLiteral = combineReader([
  readBinaryIntegerLiteral,
  readOctalIntegerLiteral,
  readHexIntegerLiteral
]);
var readNumericLiteral = combineReader([
  readNonDecimalIntegerLiteral,
  readDecimalLiteral
]);
function parseLiteral(text, cursor) {
  const num = readNumericLiteral(text, cursor);
  cursor += num.length;
  if (num === "") {
    return null;
  }
  return {
    evaluable: new NumberLiteralNode(num),
    cursor
  };
}
__name(parseLiteral, "parseLiteral");
function parseParenthesizedExpression(text, cursor) {
  const op = text.substr(cursor, 1);
  cursor += op.length;
  if (op !== "(") {
    return null;
  }
  const expr = parseExpression(text, cursor);
  if (!expr) {
    return null;
  }
  cursor = expr.cursor;
  cursor += readWhitespace(text, cursor).length;
  const cl = text.substr(cursor, 1);
  cursor += cl.length;
  if (cl !== ")") {
    return null;
  }
  return {
    evaluable: expr.evaluable,
    cursor
  };
}
__name(parseParenthesizedExpression, "parseParenthesizedExpression");
function parsePrimaryExpression(text, cursor) {
  var _a;
  return (_a = parseLiteral(text, cursor)) !== null && _a !== void 0 ? _a : parseParenthesizedExpression(text, cursor);
}
__name(parsePrimaryExpression, "parsePrimaryExpression");
function parseUnaryExpression(text, cursor) {
  const expr = parsePrimaryExpression(text, cursor);
  if (expr) {
    return expr;
  }
  const op = text.substr(cursor, 1);
  cursor += op.length;
  if (op !== "+" && op !== "-" && op !== "~") {
    return null;
  }
  const num = parseUnaryExpression(text, cursor);
  if (!num) {
    return null;
  }
  cursor = num.cursor;
  return {
    cursor,
    evaluable: new UnaryOperationNode(op, num.evaluable)
  };
}
__name(parseUnaryExpression, "parseUnaryExpression");
function readBinaryOperator(ops, text, cursor) {
  cursor += readWhitespace(text, cursor).length;
  const op = ops.filter((op2) => text.startsWith(op2, cursor))[0];
  if (!op) {
    return null;
  }
  cursor += op.length;
  cursor += readWhitespace(text, cursor).length;
  return {
    cursor,
    operator: op
  };
}
__name(readBinaryOperator, "readBinaryOperator");
function createBinaryOperationExpressionParser(exprParser, ops) {
  return (text, cursor) => {
    const firstExpr = exprParser(text, cursor);
    if (!firstExpr) {
      return null;
    }
    cursor = firstExpr.cursor;
    let expr = firstExpr.evaluable;
    for (; ; ) {
      const op = readBinaryOperator(ops, text, cursor);
      if (!op) {
        break;
      }
      cursor = op.cursor;
      const nextExpr = exprParser(text, cursor);
      if (!nextExpr) {
        return null;
      }
      cursor = nextExpr.cursor;
      expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
    }
    return expr ? {
      cursor,
      evaluable: expr
    } : null;
  };
}
__name(createBinaryOperationExpressionParser, "createBinaryOperationExpressionParser");
var parseBinaryOperationExpression = [
  ["**"],
  ["*", "/", "%"],
  ["+", "-"],
  ["<<", ">>>", ">>"],
  ["&"],
  ["^"],
  ["|"]
].reduce((parser, ops) => {
  return createBinaryOperationExpressionParser(parser, ops);
}, parseUnaryExpression);
function parseExpression(text, cursor) {
  cursor += readWhitespace(text, cursor).length;
  return parseBinaryOperationExpression(text, cursor);
}
__name(parseExpression, "parseExpression");
function parseEcmaNumberExpression(text) {
  const expr = parseExpression(text, 0);
  if (!expr) {
    return null;
  }
  const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
  if (cursor !== text.length) {
    return null;
  }
  return expr.evaluable;
}
__name(parseEcmaNumberExpression, "parseEcmaNumberExpression");
function parseNumber(text) {
  var _a;
  const r = parseEcmaNumberExpression(text);
  return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
}
__name(parseNumber, "parseNumber");
function numberFromUnknown(value) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const pv = parseNumber(value);
    if (!isEmpty(pv)) {
      return pv;
    }
  }
  return 0;
}
__name(numberFromUnknown, "numberFromUnknown");
function numberToString(value) {
  return String(value);
}
__name(numberToString, "numberToString");
function createNumberFormatter(digits) {
  return (value) => {
    return value.toFixed(Math.max(Math.min(digits, 20), 0));
  };
}
__name(createNumberFormatter, "createNumberFormatter");
function mapRange(value, start1, end1, start2, end2) {
  const p = (value - start1) / (end1 - start1);
  return start2 + p * (end2 - start2);
}
__name(mapRange, "mapRange");
function getDecimalDigits(value) {
  const text = String(value.toFixed(10));
  const frac = text.split(".")[1];
  return frac.replace(/0+$/, "").length;
}
__name(getDecimalDigits, "getDecimalDigits");
function constrainRange(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
__name(constrainRange, "constrainRange");
function loopRange(value, max) {
  return (value % max + max) % max;
}
__name(loopRange, "loopRange");
function getSuitableDecimalDigits(params, rawValue) {
  return !isEmpty(params.step) ? getDecimalDigits(params.step) : Math.max(getDecimalDigits(rawValue), 2);
}
__name(getSuitableDecimalDigits, "getSuitableDecimalDigits");
function getSuitableKeyScale(params) {
  var _a;
  return (_a = params.step) !== null && _a !== void 0 ? _a : 1;
}
__name(getSuitableKeyScale, "getSuitableKeyScale");
function getSuitablePointerScale(params, rawValue) {
  var _a;
  const base = Math.abs((_a = params.step) !== null && _a !== void 0 ? _a : rawValue);
  return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
}
__name(getSuitablePointerScale, "getSuitablePointerScale");
function createStepConstraint(params, initialValue) {
  if (!isEmpty(params.step)) {
    return new StepConstraint(params.step, initialValue);
  }
  return null;
}
__name(createStepConstraint, "createStepConstraint");
function createRangeConstraint(params) {
  if (!isEmpty(params.max) && !isEmpty(params.min)) {
    return new DefiniteRangeConstraint({
      max: params.max,
      min: params.min
    });
  }
  if (!isEmpty(params.max) || !isEmpty(params.min)) {
    return new RangeConstraint({
      max: params.max,
      min: params.min
    });
  }
  return null;
}
__name(createRangeConstraint, "createRangeConstraint");
function createNumberTextPropsObject(params, initialValue) {
  var _a, _b, _c;
  return {
    formatter: (_a = params.format) !== null && _a !== void 0 ? _a : createNumberFormatter(getSuitableDecimalDigits(params, initialValue)),
    keyScale: (_b = params.keyScale) !== null && _b !== void 0 ? _b : getSuitableKeyScale(params),
    pointerScale: (_c = params.pointerScale) !== null && _c !== void 0 ? _c : getSuitablePointerScale(params, initialValue)
  };
}
__name(createNumberTextPropsObject, "createNumberTextPropsObject");
function createNumberTextInputParamsParser(p) {
  return {
    format: p.optional.function,
    keyScale: p.optional.number,
    max: p.optional.number,
    min: p.optional.number,
    pointerScale: p.optional.number,
    step: p.optional.number
  };
}
__name(createNumberTextInputParamsParser, "createNumberTextInputParamsParser");
function createPointAxis(config) {
  return {
    constraint: config.constraint,
    textProps: ValueMap.fromObject(createNumberTextPropsObject(config.params, config.initialValue))
  };
}
__name(createPointAxis, "createPointAxis");
var BladeApi = class {
  static {
    __name(this, "BladeApi");
  }
  constructor(controller) {
    this.controller = controller;
  }
  get element() {
    return this.controller.view.element;
  }
  get disabled() {
    return this.controller.viewProps.get("disabled");
  }
  set disabled(disabled) {
    this.controller.viewProps.set("disabled", disabled);
  }
  get hidden() {
    return this.controller.viewProps.get("hidden");
  }
  set hidden(hidden) {
    this.controller.viewProps.set("hidden", hidden);
  }
  dispose() {
    this.controller.viewProps.set("disposed", true);
  }
  importState(state) {
    return this.controller.importState(state);
  }
  exportState() {
    return this.controller.exportState();
  }
};
var TpEvent = class {
  static {
    __name(this, "TpEvent");
  }
  constructor(target) {
    this.target = target;
  }
};
var TpChangeEvent = class extends TpEvent {
  static {
    __name(this, "TpChangeEvent");
  }
  constructor(target, value, last) {
    super(target);
    this.value = value;
    this.last = last !== null && last !== void 0 ? last : true;
  }
};
var TpFoldEvent = class extends TpEvent {
  static {
    __name(this, "TpFoldEvent");
  }
  constructor(target, expanded) {
    super(target);
    this.expanded = expanded;
  }
};
var TpTabSelectEvent = class extends TpEvent {
  static {
    __name(this, "TpTabSelectEvent");
  }
  constructor(target, index) {
    super(target);
    this.index = index;
  }
};
var TpMouseEvent = class extends TpEvent {
  static {
    __name(this, "TpMouseEvent");
  }
  constructor(target, nativeEvent) {
    super(target);
    this.native = nativeEvent;
  }
};
var BindingApi = class extends BladeApi {
  static {
    __name(this, "BindingApi");
  }
  constructor(controller) {
    super(controller);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.emitter_ = new Emitter();
    this.controller.value.emitter.on("change", this.onValueChange_);
  }
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(label) {
    this.controller.labelController.props.set("label", label);
  }
  get key() {
    return this.controller.value.binding.target.key;
  }
  get tag() {
    return this.controller.tag;
  }
  set tag(tag) {
    this.controller.tag = tag;
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
  refresh() {
    this.controller.value.fetch();
  }
  onValueChange_(ev) {
    const value = this.controller.value;
    this.emitter_.emit("change", new TpChangeEvent(this, forceCast(value.binding.target.read()), ev.options.last));
  }
};
var InputBindingValue = class {
  static {
    __name(this, "InputBindingValue");
  }
  constructor(value, binding) {
    this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.binding = binding;
    this.value_ = value;
    this.value_.emitter.on("beforechange", this.onValueBeforeChange_);
    this.value_.emitter.on("change", this.onValueChange_);
    this.emitter = new Emitter();
  }
  get rawValue() {
    return this.value_.rawValue;
  }
  set rawValue(rawValue) {
    this.value_.rawValue = rawValue;
  }
  setRawValue(rawValue, options) {
    this.value_.setRawValue(rawValue, options);
  }
  fetch() {
    this.value_.rawValue = this.binding.read();
  }
  push() {
    this.binding.write(this.value_.rawValue);
  }
  onValueBeforeChange_(ev) {
    this.emitter.emit("beforechange", Object.assign(Object.assign({}, ev), { sender: this }));
  }
  onValueChange_(ev) {
    this.push();
    this.emitter.emit("change", Object.assign(Object.assign({}, ev), { sender: this }));
  }
};
function isInputBindingValue(v) {
  if (!("binding" in v)) {
    return false;
  }
  const b = v["binding"];
  return isBinding(b) && "read" in b && "write" in b;
}
__name(isInputBindingValue, "isInputBindingValue");
function parseObject(value, keyToParserMap) {
  const keys = Object.keys(keyToParserMap);
  const result = keys.reduce((tmp, key) => {
    if (tmp === void 0) {
      return void 0;
    }
    const parser = keyToParserMap[key];
    const result2 = parser(value[key]);
    return result2.succeeded ? Object.assign(Object.assign({}, tmp), { [key]: result2.value }) : void 0;
  }, {});
  return forceCast(result);
}
__name(parseObject, "parseObject");
function parseArray(value, parseItem) {
  return value.reduce((tmp, item) => {
    if (tmp === void 0) {
      return void 0;
    }
    const result = parseItem(item);
    if (!result.succeeded || result.value === void 0) {
      return void 0;
    }
    return [...tmp, result.value];
  }, []);
}
__name(parseArray, "parseArray");
function isObject(value) {
  if (value === null) {
    return false;
  }
  return typeof value === "object";
}
__name(isObject, "isObject");
function createMicroParserBuilder(parse) {
  return (optional) => (v) => {
    if (!optional && v === void 0) {
      return {
        succeeded: false,
        value: void 0
      };
    }
    if (optional && v === void 0) {
      return {
        succeeded: true,
        value: void 0
      };
    }
    const result = parse(v);
    return result !== void 0 ? {
      succeeded: true,
      value: result
    } : {
      succeeded: false,
      value: void 0
    };
  };
}
__name(createMicroParserBuilder, "createMicroParserBuilder");
function createMicroParserBuilders(optional) {
  return {
    custom: /* @__PURE__ */ __name((parse) => createMicroParserBuilder(parse)(optional), "custom"),
    boolean: createMicroParserBuilder((v) => typeof v === "boolean" ? v : void 0)(optional),
    number: createMicroParserBuilder((v) => typeof v === "number" ? v : void 0)(optional),
    string: createMicroParserBuilder((v) => typeof v === "string" ? v : void 0)(optional),
    function: createMicroParserBuilder((v) => typeof v === "function" ? v : void 0)(optional),
    constant: /* @__PURE__ */ __name((value) => createMicroParserBuilder((v) => v === value ? value : void 0)(optional), "constant"),
    raw: createMicroParserBuilder((v) => v)(optional),
    object: /* @__PURE__ */ __name((keyToParserMap) => createMicroParserBuilder((v) => {
      if (!isObject(v)) {
        return void 0;
      }
      return parseObject(v, keyToParserMap);
    })(optional), "object"),
    array: /* @__PURE__ */ __name((itemParser) => createMicroParserBuilder((v) => {
      if (!Array.isArray(v)) {
        return void 0;
      }
      return parseArray(v, itemParser);
    })(optional), "array")
  };
}
__name(createMicroParserBuilders, "createMicroParserBuilders");
var MicroParsers = {
  optional: createMicroParserBuilders(true),
  required: createMicroParserBuilders(false)
};
function parseRecord(value, keyToParserMap) {
  const map = keyToParserMap(MicroParsers);
  const result = MicroParsers.required.object(map)(value);
  return result.succeeded ? result.value : void 0;
}
__name(parseRecord, "parseRecord");
function importBladeState(state, superImport, parser, callback) {
  if (superImport && !superImport(state)) {
    return false;
  }
  const result = parseRecord(state, parser);
  return result ? callback(result) : false;
}
__name(importBladeState, "importBladeState");
function exportBladeState(superExport, thisState) {
  var _a;
  return deepMerge((_a = superExport === null || superExport === void 0 ? void 0 : superExport()) !== null && _a !== void 0 ? _a : {}, thisState);
}
__name(exportBladeState, "exportBladeState");
function isValueBladeController(bc) {
  return "value" in bc;
}
__name(isValueBladeController, "isValueBladeController");
function isBindingValue(v) {
  if (!isObject$1(v) || !("binding" in v)) {
    return false;
  }
  const b = v.binding;
  return isBinding(b);
}
__name(isBindingValue, "isBindingValue");
var SVG_NS = "http://www.w3.org/2000/svg";
function forceReflow(element) {
  element.offsetHeight;
}
__name(forceReflow, "forceReflow");
function disableTransitionTemporarily(element, callback) {
  const t = element.style.transition;
  element.style.transition = "none";
  callback();
  element.style.transition = t;
}
__name(disableTransitionTemporarily, "disableTransitionTemporarily");
function supportsTouch(doc) {
  return doc.ontouchstart !== void 0;
}
__name(supportsTouch, "supportsTouch");
function getGlobalObject() {
  return globalThis;
}
__name(getGlobalObject, "getGlobalObject");
function getWindowDocument() {
  const globalObj = forceCast(getGlobalObject());
  return globalObj.document;
}
__name(getWindowDocument, "getWindowDocument");
function getCanvasContext(canvasElement) {
  const win = canvasElement.ownerDocument.defaultView;
  if (!win) {
    return null;
  }
  const isBrowser = "document" in win;
  return isBrowser ? canvasElement.getContext("2d", {
    willReadFrequently: true
  }) : null;
}
__name(getCanvasContext, "getCanvasContext");
var ICON_ID_TO_INNER_HTML_MAP = {
  check: '<path d="M2 8l4 4l8 -8"/>',
  dropdown: '<path d="M5 7h6l-3 3 z"/>',
  p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'
};
function createSvgIconElement(document2, iconId) {
  const elem = document2.createElementNS(SVG_NS, "svg");
  elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
  return elem;
}
__name(createSvgIconElement, "createSvgIconElement");
function insertElementAt(parentElement, element, index) {
  parentElement.insertBefore(element, parentElement.children[index]);
}
__name(insertElementAt, "insertElementAt");
function removeElement(element) {
  if (element.parentElement) {
    element.parentElement.removeChild(element);
  }
}
__name(removeElement, "removeElement");
function removeChildElements(element) {
  while (element.children.length > 0) {
    element.removeChild(element.children[0]);
  }
}
__name(removeChildElements, "removeChildElements");
function removeChildNodes(element) {
  while (element.childNodes.length > 0) {
    element.removeChild(element.childNodes[0]);
  }
}
__name(removeChildNodes, "removeChildNodes");
function findNextTarget(ev) {
  if (ev.relatedTarget) {
    return forceCast(ev.relatedTarget);
  }
  if ("explicitOriginalTarget" in ev) {
    return ev.explicitOriginalTarget;
  }
  return null;
}
__name(findNextTarget, "findNextTarget");
function bindValue(value, applyValue) {
  value.emitter.on("change", (ev) => {
    applyValue(ev.rawValue);
  });
  applyValue(value.rawValue);
}
__name(bindValue, "bindValue");
function bindValueMap(valueMap, key, applyValue) {
  bindValue(valueMap.value(key), applyValue);
}
__name(bindValueMap, "bindValueMap");
var PREFIX = "tp";
function ClassName(viewName) {
  const fn = /* @__PURE__ */ __name((opt_elementName, opt_modifier) => {
    return [
      PREFIX,
      "-",
      viewName,
      "v",
      opt_elementName ? `_${opt_elementName}` : "",
      opt_modifier ? `-${opt_modifier}` : ""
    ].join("");
  }, "fn");
  return fn;
}
__name(ClassName, "ClassName");
var cn$r = ClassName("lbl");
function createLabelNode(doc, label) {
  const frag = doc.createDocumentFragment();
  const lineNodes = label.split("\n").map((line) => {
    return doc.createTextNode(line);
  });
  lineNodes.forEach((lineNode, index) => {
    if (index > 0) {
      frag.appendChild(doc.createElement("br"));
    }
    frag.appendChild(lineNode);
  });
  return frag;
}
__name(createLabelNode, "createLabelNode");
var LabelView = class {
  static {
    __name(this, "LabelView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$r());
    config.viewProps.bindClassModifiers(this.element);
    const labelElem = doc.createElement("div");
    labelElem.classList.add(cn$r("l"));
    bindValueMap(config.props, "label", (value) => {
      if (isEmpty(value)) {
        this.element.classList.add(cn$r(void 0, "nol"));
      } else {
        this.element.classList.remove(cn$r(void 0, "nol"));
        removeChildNodes(labelElem);
        labelElem.appendChild(createLabelNode(doc, value));
      }
    });
    this.element.appendChild(labelElem);
    this.labelElement = labelElem;
    const valueElem = doc.createElement("div");
    valueElem.classList.add(cn$r("v"));
    this.element.appendChild(valueElem);
    this.valueElement = valueElem;
  }
};
var LabelController = class {
  static {
    __name(this, "LabelController");
  }
  constructor(doc, config) {
    this.props = config.props;
    this.valueController = config.valueController;
    this.viewProps = config.valueController.viewProps;
    this.view = new LabelView(doc, {
      props: config.props,
      viewProps: this.viewProps
    });
    this.view.valueElement.appendChild(this.valueController.view.element);
  }
  importProps(state) {
    return importBladeState(state, null, (p) => ({
      label: p.optional.string
    }), (result) => {
      this.props.set("label", result.label);
      return true;
    });
  }
  exportProps() {
    return exportBladeState(null, {
      label: this.props.get("label")
    });
  }
};
function getAllBladePositions() {
  return ["veryfirst", "first", "last", "verylast"];
}
__name(getAllBladePositions, "getAllBladePositions");
var cn$q = ClassName("");
var POS_TO_CLASS_NAME_MAP = {
  veryfirst: "vfst",
  first: "fst",
  last: "lst",
  verylast: "vlst"
};
var BladeController = class {
  static {
    __name(this, "BladeController");
  }
  constructor(config) {
    this.parent_ = null;
    this.blade = config.blade;
    this.view = config.view;
    this.viewProps = config.viewProps;
    const elem = this.view.element;
    this.blade.value("positions").emitter.on("change", () => {
      getAllBladePositions().forEach((pos) => {
        elem.classList.remove(cn$q(void 0, POS_TO_CLASS_NAME_MAP[pos]));
      });
      this.blade.get("positions").forEach((pos) => {
        elem.classList.add(cn$q(void 0, POS_TO_CLASS_NAME_MAP[pos]));
      });
    });
    this.viewProps.handleDispose(() => {
      removeElement(elem);
    });
  }
  get parent() {
    return this.parent_;
  }
  set parent(parent) {
    this.parent_ = parent;
    this.viewProps.set("parent", this.parent_ ? this.parent_.viewProps : null);
  }
  importState(state) {
    return importBladeState(state, null, (p) => ({
      disabled: p.required.boolean,
      hidden: p.required.boolean
    }), (result) => {
      this.viewProps.importState(result);
      return true;
    });
  }
  exportState() {
    return exportBladeState(null, Object.assign({}, this.viewProps.exportState()));
  }
};
var LabeledValueBladeController = class extends BladeController {
  static {
    __name(this, "LabeledValueBladeController");
  }
  constructor(doc, config) {
    if (config.value !== config.valueController.value) {
      throw TpError.shouldNeverHappen();
    }
    const viewProps = config.valueController.viewProps;
    const lc = new LabelController(doc, {
      blade: config.blade,
      props: config.props,
      valueController: config.valueController
    });
    super(Object.assign(Object.assign({}, config), { view: new LabelView(doc, {
      props: config.props,
      viewProps
    }), viewProps }));
    this.labelController = lc;
    this.value = config.value;
    this.valueController = config.valueController;
    this.view.valueElement.appendChild(this.valueController.view.element);
  }
  importState(state) {
    return importBladeState(state, (s) => {
      var _a, _b, _c;
      return super.importState(s) && this.labelController.importProps(s) && ((_c = (_b = (_a = this.valueController).importProps) === null || _b === void 0 ? void 0 : _b.call(_a, state)) !== null && _c !== void 0 ? _c : true);
    }, (p) => ({
      value: p.optional.raw
    }), (result) => {
      if (result.value) {
        this.value.rawValue = result.value;
      }
      return true;
    });
  }
  exportState() {
    var _a, _b, _c;
    return exportBladeState(() => super.exportState(), Object.assign(Object.assign({ value: this.value.rawValue }, this.labelController.exportProps()), (_c = (_b = (_a = this.valueController).exportProps) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : {}));
  }
};
function excludeValue(state) {
  const result = Object.assign({}, state);
  delete result.value;
  return result;
}
__name(excludeValue, "excludeValue");
var BindingController = class extends LabeledValueBladeController {
  static {
    __name(this, "BindingController");
  }
  constructor(doc, config) {
    super(doc, config);
    this.tag = config.tag;
  }
  importState(state) {
    return importBladeState(
      state,
      (_s) => super.importState(excludeValue(state)),
      (p) => ({
        tag: p.optional.string
      }),
      (result) => {
        this.tag = result.tag;
        return true;
      }
    );
  }
  exportState() {
    return exportBladeState(() => excludeValue(super.exportState()), {
      binding: {
        key: this.value.binding.target.key,
        value: this.value.binding.target.read()
      },
      tag: this.tag
    });
  }
};
function isBindingController(bc) {
  return isValueBladeController(bc) && isBindingValue(bc.value);
}
__name(isBindingController, "isBindingController");
var InputBindingController = class extends BindingController {
  static {
    __name(this, "InputBindingController");
  }
  importState(state) {
    return importBladeState(state, (s) => super.importState(s), (p) => ({
      binding: p.required.object({
        value: p.required.raw
      })
    }), (result) => {
      this.value.binding.inject(result.binding.value);
      this.value.fetch();
      return true;
    });
  }
};
function isInputBindingController(bc) {
  return isValueBladeController(bc) && isInputBindingValue(bc.value);
}
__name(isInputBindingController, "isInputBindingController");
function fillBuffer(buffer, bufferSize) {
  while (buffer.length < bufferSize) {
    buffer.push(void 0);
  }
}
__name(fillBuffer, "fillBuffer");
function initializeBuffer(bufferSize) {
  const buffer = [];
  fillBuffer(buffer, bufferSize);
  return buffer;
}
__name(initializeBuffer, "initializeBuffer");
function createTrimmedBuffer(buffer) {
  const index = buffer.indexOf(void 0);
  return forceCast(index < 0 ? buffer : buffer.slice(0, index));
}
__name(createTrimmedBuffer, "createTrimmedBuffer");
function createPushedBuffer(buffer, newValue) {
  const newBuffer = [...createTrimmedBuffer(buffer), newValue];
  if (newBuffer.length > buffer.length) {
    newBuffer.splice(0, newBuffer.length - buffer.length);
  } else {
    fillBuffer(newBuffer, buffer.length);
  }
  return newBuffer;
}
__name(createPushedBuffer, "createPushedBuffer");
var MonitorBindingValue = class {
  static {
    __name(this, "MonitorBindingValue");
  }
  constructor(config) {
    this.emitter = new Emitter();
    this.onTick_ = this.onTick_.bind(this);
    this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.binding = config.binding;
    this.value_ = createValue(initializeBuffer(config.bufferSize));
    this.value_.emitter.on("beforechange", this.onValueBeforeChange_);
    this.value_.emitter.on("change", this.onValueChange_);
    this.ticker = config.ticker;
    this.ticker.emitter.on("tick", this.onTick_);
    this.fetch();
  }
  get rawValue() {
    return this.value_.rawValue;
  }
  set rawValue(rawValue) {
    this.value_.rawValue = rawValue;
  }
  setRawValue(rawValue, options) {
    this.value_.setRawValue(rawValue, options);
  }
  fetch() {
    this.value_.rawValue = createPushedBuffer(this.value_.rawValue, this.binding.read());
  }
  onTick_() {
    this.fetch();
  }
  onValueBeforeChange_(ev) {
    this.emitter.emit("beforechange", Object.assign(Object.assign({}, ev), { sender: this }));
  }
  onValueChange_(ev) {
    this.emitter.emit("change", Object.assign(Object.assign({}, ev), { sender: this }));
  }
};
function isMonitorBindingValue(v) {
  if (!("binding" in v)) {
    return false;
  }
  const b = v["binding"];
  return isBinding(b) && "read" in b && !("write" in b);
}
__name(isMonitorBindingValue, "isMonitorBindingValue");
var MonitorBindingController = class extends BindingController {
  static {
    __name(this, "MonitorBindingController");
  }
  exportState() {
    return exportBladeState(() => super.exportState(), {
      binding: {
        readonly: true
      }
    });
  }
};
function isMonitorBindingController(bc) {
  return isValueBladeController(bc) && isMonitorBindingValue(bc.value);
}
__name(isMonitorBindingController, "isMonitorBindingController");
var ButtonApi = class extends BladeApi {
  static {
    __name(this, "ButtonApi");
  }
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(label) {
    this.controller.labelController.props.set("label", label);
  }
  get title() {
    var _a;
    return (_a = this.controller.buttonController.props.get("title")) !== null && _a !== void 0 ? _a : "";
  }
  set title(title) {
    this.controller.buttonController.props.set("title", title);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    const emitter = this.controller.buttonController.emitter;
    emitter.on(eventName, (ev) => {
      bh(new TpMouseEvent(this, ev.nativeEvent));
    });
    return this;
  }
  off(eventName, handler) {
    const emitter = this.controller.buttonController.emitter;
    emitter.off(eventName, handler);
    return this;
  }
};
function applyClass(elem, className, active) {
  if (active) {
    elem.classList.add(className);
  } else {
    elem.classList.remove(className);
  }
}
__name(applyClass, "applyClass");
function valueToClassName(elem, className) {
  return (value) => {
    applyClass(elem, className, value);
  };
}
__name(valueToClassName, "valueToClassName");
function bindValueToTextContent(value, elem) {
  bindValue(value, (text) => {
    elem.textContent = text !== null && text !== void 0 ? text : "";
  });
}
__name(bindValueToTextContent, "bindValueToTextContent");
var cn$p = ClassName("btn");
var ButtonView = class {
  static {
    __name(this, "ButtonView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$p());
    config.viewProps.bindClassModifiers(this.element);
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(cn$p("b"));
    config.viewProps.bindDisabled(buttonElem);
    this.element.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    const titleElem = doc.createElement("div");
    titleElem.classList.add(cn$p("t"));
    bindValueToTextContent(config.props.value("title"), titleElem);
    this.buttonElement.appendChild(titleElem);
  }
};
var ButtonController = class {
  static {
    __name(this, "ButtonController");
  }
  constructor(doc, config) {
    this.emitter = new Emitter();
    this.onClick_ = this.onClick_.bind(this);
    this.props = config.props;
    this.viewProps = config.viewProps;
    this.view = new ButtonView(doc, {
      props: this.props,
      viewProps: this.viewProps
    });
    this.view.buttonElement.addEventListener("click", this.onClick_);
  }
  importProps(state) {
    return importBladeState(state, null, (p) => ({
      title: p.optional.string
    }), (result) => {
      this.props.set("title", result.title);
      return true;
    });
  }
  exportProps() {
    return exportBladeState(null, {
      title: this.props.get("title")
    });
  }
  onClick_(ev) {
    this.emitter.emit("click", {
      nativeEvent: ev,
      sender: this
    });
  }
};
var ButtonBladeController = class extends BladeController {
  static {
    __name(this, "ButtonBladeController");
  }
  constructor(doc, config) {
    const bc = new ButtonController(doc, {
      props: config.buttonProps,
      viewProps: config.viewProps
    });
    const lc = new LabelController(doc, {
      blade: config.blade,
      props: config.labelProps,
      valueController: bc
    });
    super({
      blade: config.blade,
      view: lc.view,
      viewProps: config.viewProps
    });
    this.buttonController = bc;
    this.labelController = lc;
  }
  importState(state) {
    return importBladeState(state, (s) => super.importState(s) && this.buttonController.importProps(s) && this.labelController.importProps(s), () => ({}), () => true);
  }
  exportState() {
    return exportBladeState(() => super.exportState(), Object.assign(Object.assign({}, this.buttonController.exportProps()), this.labelController.exportProps()));
  }
};
var Semver = class {
  static {
    __name(this, "Semver");
  }
  constructor(text) {
    const [core, prerelease] = text.split("-");
    const coreComps = core.split(".");
    this.major = parseInt(coreComps[0], 10);
    this.minor = parseInt(coreComps[1], 10);
    this.patch = parseInt(coreComps[2], 10);
    this.prerelease = prerelease !== null && prerelease !== void 0 ? prerelease : null;
  }
  toString() {
    const core = [this.major, this.minor, this.patch].join(".");
    return this.prerelease !== null ? [core, this.prerelease].join("-") : core;
  }
};
var VERSION$1 = new Semver("2.0.5");
function createPlugin(plugin) {
  return Object.assign({ core: VERSION$1 }, plugin);
}
__name(createPlugin, "createPlugin");
var ButtonBladePlugin = createPlugin({
  id: "button",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      title: p.required.string,
      view: p.required.constant("button"),
      label: p.optional.string
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    return new ButtonBladeController(args.document, {
      blade: args.blade,
      buttonProps: ValueMap.fromObject({
        title: args.params.title
      }),
      labelProps: ValueMap.fromObject({
        label: args.params.label
      }),
      viewProps: args.viewProps
    });
  },
  api(args) {
    if (args.controller instanceof ButtonBladeController) {
      return new ButtonApi(args.controller);
    }
    return null;
  }
});
function addButtonAsBlade(api, params) {
  return api.addBlade(Object.assign(Object.assign({}, params), { view: "button" }));
}
__name(addButtonAsBlade, "addButtonAsBlade");
function addFolderAsBlade(api, params) {
  return api.addBlade(Object.assign(Object.assign({}, params), { view: "folder" }));
}
__name(addFolderAsBlade, "addFolderAsBlade");
function addTabAsBlade(api, params) {
  return api.addBlade(Object.assign(Object.assign({}, params), { view: "tab" }));
}
__name(addTabAsBlade, "addTabAsBlade");
function isRefreshable(value) {
  if (!isObject$1(value)) {
    return false;
  }
  return "refresh" in value && typeof value.refresh === "function";
}
__name(isRefreshable, "isRefreshable");
function createBindingTarget(obj, key) {
  if (!BindingTarget.isBindable(obj)) {
    throw TpError.notBindable();
  }
  return new BindingTarget(obj, key);
}
__name(createBindingTarget, "createBindingTarget");
var RackApi = class {
  static {
    __name(this, "RackApi");
  }
  constructor(controller, pool) {
    this.onRackValueChange_ = this.onRackValueChange_.bind(this);
    this.controller_ = controller;
    this.emitter_ = new Emitter();
    this.pool_ = pool;
    const rack = this.controller_.rack;
    rack.emitter.on("valuechange", this.onRackValueChange_);
  }
  get children() {
    return this.controller_.rack.children.map((bc) => this.pool_.createApi(bc));
  }
  addBinding(object, key, opt_params) {
    const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
    const doc = this.controller_.element.ownerDocument;
    const bc = this.pool_.createBinding(doc, createBindingTarget(object, key), params);
    const api = this.pool_.createBindingApi(bc);
    return this.add(api, params.index);
  }
  addFolder(params) {
    return addFolderAsBlade(this, params);
  }
  addButton(params) {
    return addButtonAsBlade(this, params);
  }
  addTab(params) {
    return addTabAsBlade(this, params);
  }
  add(api, opt_index) {
    const bc = api.controller;
    this.controller_.rack.add(bc, opt_index);
    return api;
  }
  remove(api) {
    this.controller_.rack.remove(api.controller);
  }
  addBlade(params) {
    const doc = this.controller_.element.ownerDocument;
    const bc = this.pool_.createBlade(doc, params);
    const api = this.pool_.createApi(bc);
    return this.add(api, params.index);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
  refresh() {
    this.children.forEach((c) => {
      if (isRefreshable(c)) {
        c.refresh();
      }
    });
  }
  onRackValueChange_(ev) {
    const bc = ev.bladeController;
    const api = this.pool_.createApi(bc);
    const binding = isBindingValue(bc.value) ? bc.value.binding : null;
    this.emitter_.emit("change", new TpChangeEvent(api, binding ? binding.target.read() : bc.value.rawValue, ev.options.last));
  }
};
var ContainerBladeApi = class extends BladeApi {
  static {
    __name(this, "ContainerBladeApi");
  }
  constructor(controller, pool) {
    super(controller);
    this.rackApi_ = new RackApi(controller.rackController, pool);
  }
  refresh() {
    this.rackApi_.refresh();
  }
};
var ContainerBladeController = class extends BladeController {
  static {
    __name(this, "ContainerBladeController");
  }
  constructor(config) {
    super({
      blade: config.blade,
      view: config.view,
      viewProps: config.rackController.viewProps
    });
    this.rackController = config.rackController;
  }
  importState(state) {
    return importBladeState(state, (s) => super.importState(s), (p) => ({
      children: p.required.array(p.required.raw)
    }), (result) => {
      return this.rackController.rack.children.every((c, index) => {
        return c.importState(result.children[index]);
      });
    });
  }
  exportState() {
    return exportBladeState(() => super.exportState(), {
      children: this.rackController.rack.children.map((c) => c.exportState())
    });
  }
};
function isContainerBladeController(bc) {
  return "rackController" in bc;
}
__name(isContainerBladeController, "isContainerBladeController");
var NestedOrderedSet = class {
  static {
    __name(this, "NestedOrderedSet");
  }
  constructor(extract) {
    this.emitter = new Emitter();
    this.items_ = [];
    this.cache_ = /* @__PURE__ */ new Set();
    this.onSubListAdd_ = this.onSubListAdd_.bind(this);
    this.onSubListRemove_ = this.onSubListRemove_.bind(this);
    this.extract_ = extract;
  }
  get items() {
    return this.items_;
  }
  allItems() {
    return Array.from(this.cache_);
  }
  find(callback) {
    for (const item of this.allItems()) {
      if (callback(item)) {
        return item;
      }
    }
    return null;
  }
  includes(item) {
    return this.cache_.has(item);
  }
  add(item, opt_index) {
    if (this.includes(item)) {
      throw TpError.shouldNeverHappen();
    }
    const index = opt_index !== void 0 ? opt_index : this.items_.length;
    this.items_.splice(index, 0, item);
    this.cache_.add(item);
    const subList = this.extract_(item);
    if (subList) {
      subList.emitter.on("add", this.onSubListAdd_);
      subList.emitter.on("remove", this.onSubListRemove_);
      subList.allItems().forEach((i) => {
        this.cache_.add(i);
      });
    }
    this.emitter.emit("add", {
      index,
      item,
      root: this,
      target: this
    });
  }
  remove(item) {
    const index = this.items_.indexOf(item);
    if (index < 0) {
      return;
    }
    this.items_.splice(index, 1);
    this.cache_.delete(item);
    const subList = this.extract_(item);
    if (subList) {
      subList.allItems().forEach((i) => {
        this.cache_.delete(i);
      });
      subList.emitter.off("add", this.onSubListAdd_);
      subList.emitter.off("remove", this.onSubListRemove_);
    }
    this.emitter.emit("remove", {
      index,
      item,
      root: this,
      target: this
    });
  }
  onSubListAdd_(ev) {
    this.cache_.add(ev.item);
    this.emitter.emit("add", {
      index: ev.index,
      item: ev.item,
      root: this,
      target: ev.target
    });
  }
  onSubListRemove_(ev) {
    this.cache_.delete(ev.item);
    this.emitter.emit("remove", {
      index: ev.index,
      item: ev.item,
      root: this,
      target: ev.target
    });
  }
};
function findValueBladeController(bcs, v) {
  for (let i = 0; i < bcs.length; i++) {
    const bc = bcs[i];
    if (isValueBladeController(bc) && bc.value === v) {
      return bc;
    }
  }
  return null;
}
__name(findValueBladeController, "findValueBladeController");
function findSubBladeControllerSet(bc) {
  return isContainerBladeController(bc) ? bc.rackController.rack["bcSet_"] : null;
}
__name(findSubBladeControllerSet, "findSubBladeControllerSet");
var Rack = class {
  static {
    __name(this, "Rack");
  }
  constructor(config) {
    var _a, _b;
    this.emitter = new Emitter();
    this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
    this.onSetAdd_ = this.onSetAdd_.bind(this);
    this.onSetRemove_ = this.onSetRemove_.bind(this);
    this.onChildDispose_ = this.onChildDispose_.bind(this);
    this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
    this.onChildValueChange_ = this.onChildValueChange_.bind(this);
    this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
    this.onRackLayout_ = this.onRackLayout_.bind(this);
    this.onRackValueChange_ = this.onRackValueChange_.bind(this);
    this.blade_ = (_a = config.blade) !== null && _a !== void 0 ? _a : null;
    (_b = this.blade_) === null || _b === void 0 ? void 0 : _b.value("positions").emitter.on("change", this.onBladePositionsChange_);
    this.viewProps = config.viewProps;
    this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
    this.bcSet_.emitter.on("add", this.onSetAdd_);
    this.bcSet_.emitter.on("remove", this.onSetRemove_);
  }
  get children() {
    return this.bcSet_.items;
  }
  add(bc, opt_index) {
    var _a;
    (_a = bc.parent) === null || _a === void 0 ? void 0 : _a.remove(bc);
    bc.parent = this;
    this.bcSet_.add(bc, opt_index);
  }
  remove(bc) {
    bc.parent = null;
    this.bcSet_.remove(bc);
  }
  find(finder) {
    return this.bcSet_.allItems().filter(finder);
  }
  onSetAdd_(ev) {
    this.updatePositions_();
    const root = ev.target === ev.root;
    this.emitter.emit("add", {
      bladeController: ev.item,
      index: ev.index,
      root,
      sender: this
    });
    if (!root) {
      return;
    }
    const bc = ev.item;
    bc.viewProps.emitter.on("change", this.onChildViewPropsChange_);
    bc.blade.value("positions").emitter.on("change", this.onChildPositionsChange_);
    bc.viewProps.handleDispose(this.onChildDispose_);
    if (isValueBladeController(bc)) {
      bc.value.emitter.on("change", this.onChildValueChange_);
    } else if (isContainerBladeController(bc)) {
      const rack = bc.rackController.rack;
      if (rack) {
        const emitter = rack.emitter;
        emitter.on("layout", this.onRackLayout_);
        emitter.on("valuechange", this.onRackValueChange_);
      }
    }
  }
  onSetRemove_(ev) {
    this.updatePositions_();
    const root = ev.target === ev.root;
    this.emitter.emit("remove", {
      bladeController: ev.item,
      root,
      sender: this
    });
    if (!root) {
      return;
    }
    const bc = ev.item;
    if (isValueBladeController(bc)) {
      bc.value.emitter.off("change", this.onChildValueChange_);
    } else if (isContainerBladeController(bc)) {
      const rack = bc.rackController.rack;
      if (rack) {
        const emitter = rack.emitter;
        emitter.off("layout", this.onRackLayout_);
        emitter.off("valuechange", this.onRackValueChange_);
      }
    }
  }
  updatePositions_() {
    const visibleItems = this.bcSet_.items.filter((bc) => !bc.viewProps.get("hidden"));
    const firstVisibleItem = visibleItems[0];
    const lastVisibleItem = visibleItems[visibleItems.length - 1];
    this.bcSet_.items.forEach((bc) => {
      const ps = [];
      if (bc === firstVisibleItem) {
        ps.push("first");
        if (!this.blade_ || this.blade_.get("positions").includes("veryfirst")) {
          ps.push("veryfirst");
        }
      }
      if (bc === lastVisibleItem) {
        ps.push("last");
        if (!this.blade_ || this.blade_.get("positions").includes("verylast")) {
          ps.push("verylast");
        }
      }
      bc.blade.set("positions", ps);
    });
  }
  onChildPositionsChange_() {
    this.updatePositions_();
    this.emitter.emit("layout", {
      sender: this
    });
  }
  onChildViewPropsChange_(_ev) {
    this.updatePositions_();
    this.emitter.emit("layout", {
      sender: this
    });
  }
  onChildDispose_() {
    const disposedUcs = this.bcSet_.items.filter((bc) => {
      return bc.viewProps.get("disposed");
    });
    disposedUcs.forEach((bc) => {
      this.bcSet_.remove(bc);
    });
  }
  onChildValueChange_(ev) {
    const bc = findValueBladeController(this.find(isValueBladeController), ev.sender);
    if (!bc) {
      throw TpError.alreadyDisposed();
    }
    this.emitter.emit("valuechange", {
      bladeController: bc,
      options: ev.options,
      sender: this
    });
  }
  onRackLayout_(_) {
    this.updatePositions_();
    this.emitter.emit("layout", {
      sender: this
    });
  }
  onRackValueChange_(ev) {
    this.emitter.emit("valuechange", {
      bladeController: ev.bladeController,
      options: ev.options,
      sender: this
    });
  }
  onBladePositionsChange_() {
    this.updatePositions_();
  }
};
var RackController = class {
  static {
    __name(this, "RackController");
  }
  constructor(config) {
    this.onRackAdd_ = this.onRackAdd_.bind(this);
    this.onRackRemove_ = this.onRackRemove_.bind(this);
    this.element = config.element;
    this.viewProps = config.viewProps;
    const rack = new Rack({
      blade: config.root ? void 0 : config.blade,
      viewProps: config.viewProps
    });
    rack.emitter.on("add", this.onRackAdd_);
    rack.emitter.on("remove", this.onRackRemove_);
    this.rack = rack;
    this.viewProps.handleDispose(() => {
      for (let i = this.rack.children.length - 1; i >= 0; i--) {
        const bc = this.rack.children[i];
        bc.viewProps.set("disposed", true);
      }
    });
  }
  onRackAdd_(ev) {
    if (!ev.root) {
      return;
    }
    insertElementAt(this.element, ev.bladeController.view.element, ev.index);
  }
  onRackRemove_(ev) {
    if (!ev.root) {
      return;
    }
    removeElement(ev.bladeController.view.element);
  }
};
function createBlade() {
  return new ValueMap({
    positions: createValue([], {
      equals: deepEqualsArray
    })
  });
}
__name(createBlade, "createBlade");
var Foldable = class _Foldable extends ValueMap {
  static {
    __name(this, "Foldable");
  }
  constructor(valueMap) {
    super(valueMap);
  }
  static create(expanded) {
    const coreObj = {
      completed: true,
      expanded,
      expandedHeight: null,
      shouldFixHeight: false,
      temporaryExpanded: null
    };
    const core = ValueMap.createCore(coreObj);
    return new _Foldable(core);
  }
  get styleExpanded() {
    var _a;
    return (_a = this.get("temporaryExpanded")) !== null && _a !== void 0 ? _a : this.get("expanded");
  }
  get styleHeight() {
    if (!this.styleExpanded) {
      return "0";
    }
    const exHeight = this.get("expandedHeight");
    if (this.get("shouldFixHeight") && !isEmpty(exHeight)) {
      return `${exHeight}px`;
    }
    return "auto";
  }
  bindExpandedClass(elem, expandedClassName) {
    const onExpand = /* @__PURE__ */ __name(() => {
      const expanded = this.styleExpanded;
      if (expanded) {
        elem.classList.add(expandedClassName);
      } else {
        elem.classList.remove(expandedClassName);
      }
    }, "onExpand");
    bindValueMap(this, "expanded", onExpand);
    bindValueMap(this, "temporaryExpanded", onExpand);
  }
  cleanUpTransition() {
    this.set("shouldFixHeight", false);
    this.set("expandedHeight", null);
    this.set("completed", true);
  }
};
function computeExpandedFolderHeight(folder, containerElement) {
  let height = 0;
  disableTransitionTemporarily(containerElement, () => {
    folder.set("expandedHeight", null);
    folder.set("temporaryExpanded", true);
    forceReflow(containerElement);
    height = containerElement.clientHeight;
    folder.set("temporaryExpanded", null);
    forceReflow(containerElement);
  });
  return height;
}
__name(computeExpandedFolderHeight, "computeExpandedFolderHeight");
function applyHeight(foldable, elem) {
  elem.style.height = foldable.styleHeight;
}
__name(applyHeight, "applyHeight");
function bindFoldable(foldable, elem) {
  foldable.value("expanded").emitter.on("beforechange", () => {
    foldable.set("completed", false);
    if (isEmpty(foldable.get("expandedHeight"))) {
      const h = computeExpandedFolderHeight(foldable, elem);
      if (h > 0) {
        foldable.set("expandedHeight", h);
      }
    }
    foldable.set("shouldFixHeight", true);
    forceReflow(elem);
  });
  foldable.emitter.on("change", () => {
    applyHeight(foldable, elem);
  });
  applyHeight(foldable, elem);
  elem.addEventListener("transitionend", (ev) => {
    if (ev.propertyName !== "height") {
      return;
    }
    foldable.cleanUpTransition();
  });
}
__name(bindFoldable, "bindFoldable");
var FolderApi = class extends ContainerBladeApi {
  static {
    __name(this, "FolderApi");
  }
  constructor(controller, pool) {
    super(controller, pool);
    this.emitter_ = new Emitter();
    this.controller.foldable.value("expanded").emitter.on("change", (ev) => {
      this.emitter_.emit("fold", new TpFoldEvent(this, ev.sender.rawValue));
    });
    this.rackApi_.on("change", (ev) => {
      this.emitter_.emit("change", ev);
    });
  }
  get expanded() {
    return this.controller.foldable.get("expanded");
  }
  set expanded(expanded) {
    this.controller.foldable.set("expanded", expanded);
  }
  get title() {
    return this.controller.props.get("title");
  }
  set title(title) {
    this.controller.props.set("title", title);
  }
  get children() {
    return this.rackApi_.children;
  }
  addBinding(object, key, opt_params) {
    return this.rackApi_.addBinding(object, key, opt_params);
  }
  addFolder(params) {
    return this.rackApi_.addFolder(params);
  }
  addButton(params) {
    return this.rackApi_.addButton(params);
  }
  addTab(params) {
    return this.rackApi_.addTab(params);
  }
  add(api, opt_index) {
    return this.rackApi_.add(api, opt_index);
  }
  remove(api) {
    this.rackApi_.remove(api);
  }
  addBlade(params) {
    return this.rackApi_.addBlade(params);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
};
var bladeContainerClassName = ClassName("cnt");
var FolderView = class {
  static {
    __name(this, "FolderView");
  }
  constructor(doc, config) {
    var _a;
    this.className_ = ClassName((_a = config.viewName) !== null && _a !== void 0 ? _a : "fld");
    this.element = doc.createElement("div");
    this.element.classList.add(this.className_(), bladeContainerClassName());
    config.viewProps.bindClassModifiers(this.element);
    this.foldable_ = config.foldable;
    this.foldable_.bindExpandedClass(this.element, this.className_(void 0, "expanded"));
    bindValueMap(this.foldable_, "completed", valueToClassName(this.element, this.className_(void 0, "cpl")));
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(this.className_("b"));
    bindValueMap(config.props, "title", (title) => {
      if (isEmpty(title)) {
        this.element.classList.add(this.className_(void 0, "not"));
      } else {
        this.element.classList.remove(this.className_(void 0, "not"));
      }
    });
    config.viewProps.bindDisabled(buttonElem);
    this.element.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    const indentElem = doc.createElement("div");
    indentElem.classList.add(this.className_("i"));
    this.element.appendChild(indentElem);
    const titleElem = doc.createElement("div");
    titleElem.classList.add(this.className_("t"));
    bindValueToTextContent(config.props.value("title"), titleElem);
    this.buttonElement.appendChild(titleElem);
    this.titleElement = titleElem;
    const markElem = doc.createElement("div");
    markElem.classList.add(this.className_("m"));
    this.buttonElement.appendChild(markElem);
    const containerElem = doc.createElement("div");
    containerElem.classList.add(this.className_("c"));
    this.element.appendChild(containerElem);
    this.containerElement = containerElem;
  }
};
var FolderController = class extends ContainerBladeController {
  static {
    __name(this, "FolderController");
  }
  constructor(doc, config) {
    var _a;
    const foldable = Foldable.create((_a = config.expanded) !== null && _a !== void 0 ? _a : true);
    const view = new FolderView(doc, {
      foldable,
      props: config.props,
      viewName: config.root ? "rot" : void 0,
      viewProps: config.viewProps
    });
    super(Object.assign(Object.assign({}, config), { rackController: new RackController({
      blade: config.blade,
      element: view.containerElement,
      root: config.root,
      viewProps: config.viewProps
    }), view }));
    this.onTitleClick_ = this.onTitleClick_.bind(this);
    this.props = config.props;
    this.foldable = foldable;
    bindFoldable(this.foldable, this.view.containerElement);
    this.rackController.rack.emitter.on("add", () => {
      this.foldable.cleanUpTransition();
    });
    this.rackController.rack.emitter.on("remove", () => {
      this.foldable.cleanUpTransition();
    });
    this.view.buttonElement.addEventListener("click", this.onTitleClick_);
  }
  get document() {
    return this.view.element.ownerDocument;
  }
  importState(state) {
    return importBladeState(state, (s) => super.importState(s), (p) => ({
      expanded: p.required.boolean,
      title: p.optional.string
    }), (result) => {
      this.foldable.set("expanded", result.expanded);
      this.props.set("title", result.title);
      return true;
    });
  }
  exportState() {
    return exportBladeState(() => super.exportState(), {
      expanded: this.foldable.get("expanded"),
      title: this.props.get("title")
    });
  }
  onTitleClick_() {
    this.foldable.set("expanded", !this.foldable.get("expanded"));
  }
};
var FolderBladePlugin = createPlugin({
  id: "folder",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      title: p.required.string,
      view: p.required.constant("folder"),
      expanded: p.optional.boolean
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    return new FolderController(args.document, {
      blade: args.blade,
      expanded: args.params.expanded,
      props: ValueMap.fromObject({
        title: args.params.title
      }),
      viewProps: args.viewProps
    });
  },
  api(args) {
    if (!(args.controller instanceof FolderController)) {
      return null;
    }
    return new FolderApi(args.controller, args.pool);
  }
});
var cn$o = ClassName("");
function valueToModifier(elem, modifier) {
  return valueToClassName(elem, cn$o(void 0, modifier));
}
__name(valueToModifier, "valueToModifier");
var ViewProps = class _ViewProps extends ValueMap {
  static {
    __name(this, "ViewProps");
  }
  constructor(valueMap) {
    var _a;
    super(valueMap);
    this.onDisabledChange_ = this.onDisabledChange_.bind(this);
    this.onParentChange_ = this.onParentChange_.bind(this);
    this.onParentGlobalDisabledChange_ = this.onParentGlobalDisabledChange_.bind(this);
    [this.globalDisabled_, this.setGlobalDisabled_] = createReadonlyValue(createValue(this.getGlobalDisabled_()));
    this.value("disabled").emitter.on("change", this.onDisabledChange_);
    this.value("parent").emitter.on("change", this.onParentChange_);
    (_a = this.get("parent")) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_);
  }
  static create(opt_initialValue) {
    var _a, _b, _c;
    const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {};
    return new _ViewProps(ValueMap.createCore({
      disabled: (_a = initialValue.disabled) !== null && _a !== void 0 ? _a : false,
      disposed: false,
      hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false,
      parent: (_c = initialValue.parent) !== null && _c !== void 0 ? _c : null
    }));
  }
  get globalDisabled() {
    return this.globalDisabled_;
  }
  bindClassModifiers(elem) {
    bindValue(this.globalDisabled_, valueToModifier(elem, "disabled"));
    bindValueMap(this, "hidden", valueToModifier(elem, "hidden"));
  }
  bindDisabled(target) {
    bindValue(this.globalDisabled_, (disabled) => {
      target.disabled = disabled;
    });
  }
  bindTabIndex(elem) {
    bindValue(this.globalDisabled_, (disabled) => {
      elem.tabIndex = disabled ? -1 : 0;
    });
  }
  handleDispose(callback) {
    this.value("disposed").emitter.on("change", (disposed) => {
      if (disposed) {
        callback();
      }
    });
  }
  importState(state) {
    this.set("disabled", state.disabled);
    this.set("hidden", state.hidden);
  }
  exportState() {
    return {
      disabled: this.get("disabled"),
      hidden: this.get("hidden")
    };
  }
  getGlobalDisabled_() {
    const parent = this.get("parent");
    const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
    return parentDisabled || this.get("disabled");
  }
  updateGlobalDisabled_() {
    this.setGlobalDisabled_(this.getGlobalDisabled_());
  }
  onDisabledChange_() {
    this.updateGlobalDisabled_();
  }
  onParentGlobalDisabledChange_() {
    this.updateGlobalDisabled_();
  }
  onParentChange_(ev) {
    var _a;
    const prevParent = ev.previousRawValue;
    prevParent === null || prevParent === void 0 ? void 0 : prevParent.globalDisabled.emitter.off("change", this.onParentGlobalDisabledChange_);
    (_a = this.get("parent")) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_);
    this.updateGlobalDisabled_();
  }
};
var cn$n = ClassName("tbp");
var TabPageView = class {
  static {
    __name(this, "TabPageView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$n());
    config.viewProps.bindClassModifiers(this.element);
    const containerElem = doc.createElement("div");
    containerElem.classList.add(cn$n("c"));
    this.element.appendChild(containerElem);
    this.containerElement = containerElem;
  }
};
var cn$m = ClassName("tbi");
var TabItemView = class {
  static {
    __name(this, "TabItemView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$m());
    config.viewProps.bindClassModifiers(this.element);
    bindValueMap(config.props, "selected", (selected) => {
      if (selected) {
        this.element.classList.add(cn$m(void 0, "sel"));
      } else {
        this.element.classList.remove(cn$m(void 0, "sel"));
      }
    });
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(cn$m("b"));
    config.viewProps.bindDisabled(buttonElem);
    this.element.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    const titleElem = doc.createElement("div");
    titleElem.classList.add(cn$m("t"));
    bindValueToTextContent(config.props.value("title"), titleElem);
    this.buttonElement.appendChild(titleElem);
    this.titleElement = titleElem;
  }
};
var TabItemController = class {
  static {
    __name(this, "TabItemController");
  }
  constructor(doc, config) {
    this.emitter = new Emitter();
    this.onClick_ = this.onClick_.bind(this);
    this.props = config.props;
    this.viewProps = config.viewProps;
    this.view = new TabItemView(doc, {
      props: config.props,
      viewProps: config.viewProps
    });
    this.view.buttonElement.addEventListener("click", this.onClick_);
  }
  onClick_() {
    this.emitter.emit("click", {
      sender: this
    });
  }
};
var TabPageController = class extends ContainerBladeController {
  static {
    __name(this, "TabPageController");
  }
  constructor(doc, config) {
    const view = new TabPageView(doc, {
      viewProps: config.viewProps
    });
    super(Object.assign(Object.assign({}, config), { rackController: new RackController({
      blade: config.blade,
      element: view.containerElement,
      viewProps: config.viewProps
    }), view }));
    this.onItemClick_ = this.onItemClick_.bind(this);
    this.ic_ = new TabItemController(doc, {
      props: config.itemProps,
      viewProps: ViewProps.create()
    });
    this.ic_.emitter.on("click", this.onItemClick_);
    this.props = config.props;
    bindValueMap(this.props, "selected", (selected) => {
      this.itemController.props.set("selected", selected);
      this.viewProps.set("hidden", !selected);
    });
  }
  get itemController() {
    return this.ic_;
  }
  importState(state) {
    return importBladeState(state, (s) => super.importState(s), (p) => ({
      selected: p.required.boolean,
      title: p.required.string
    }), (result) => {
      this.ic_.props.set("selected", result.selected);
      this.ic_.props.set("title", result.title);
      return true;
    });
  }
  exportState() {
    return exportBladeState(() => super.exportState(), {
      selected: this.ic_.props.get("selected"),
      title: this.ic_.props.get("title")
    });
  }
  onItemClick_() {
    this.props.set("selected", true);
  }
};
var TabApi = class extends ContainerBladeApi {
  static {
    __name(this, "TabApi");
  }
  constructor(controller, pool) {
    super(controller, pool);
    this.emitter_ = new Emitter();
    this.onSelect_ = this.onSelect_.bind(this);
    this.pool_ = pool;
    this.rackApi_.on("change", (ev) => {
      this.emitter_.emit("change", ev);
    });
    this.controller.tab.selectedIndex.emitter.on("change", this.onSelect_);
  }
  get pages() {
    return this.rackApi_.children;
  }
  addPage(params) {
    const doc = this.controller.view.element.ownerDocument;
    const pc = new TabPageController(doc, {
      blade: createBlade(),
      itemProps: ValueMap.fromObject({
        selected: false,
        title: params.title
      }),
      props: ValueMap.fromObject({
        selected: false
      }),
      viewProps: ViewProps.create()
    });
    const papi = this.pool_.createApi(pc);
    return this.rackApi_.add(papi, params.index);
  }
  removePage(index) {
    this.rackApi_.remove(this.rackApi_.children[index]);
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
  onSelect_(ev) {
    this.emitter_.emit("select", new TpTabSelectEvent(this, ev.rawValue));
  }
};
var TabPageApi = class extends ContainerBladeApi {
  static {
    __name(this, "TabPageApi");
  }
  get title() {
    var _a;
    return (_a = this.controller.itemController.props.get("title")) !== null && _a !== void 0 ? _a : "";
  }
  set title(title) {
    this.controller.itemController.props.set("title", title);
  }
  get selected() {
    return this.controller.props.get("selected");
  }
  set selected(selected) {
    this.controller.props.set("selected", selected);
  }
  get children() {
    return this.rackApi_.children;
  }
  addButton(params) {
    return this.rackApi_.addButton(params);
  }
  addFolder(params) {
    return this.rackApi_.addFolder(params);
  }
  addTab(params) {
    return this.rackApi_.addTab(params);
  }
  add(api, opt_index) {
    this.rackApi_.add(api, opt_index);
  }
  remove(api) {
    this.rackApi_.remove(api);
  }
  addBinding(object, key, opt_params) {
    return this.rackApi_.addBinding(object, key, opt_params);
  }
  addBlade(params) {
    return this.rackApi_.addBlade(params);
  }
};
var INDEX_NOT_SELECTED = -1;
var Tab = class {
  static {
    __name(this, "Tab");
  }
  constructor() {
    this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);
    this.empty = createValue(true);
    this.selectedIndex = createValue(INDEX_NOT_SELECTED);
    this.items_ = [];
  }
  add(item, opt_index) {
    const index = opt_index !== null && opt_index !== void 0 ? opt_index : this.items_.length;
    this.items_.splice(index, 0, item);
    item.emitter.on("change", this.onItemSelectedChange_);
    this.keepSelection_();
  }
  remove(item) {
    const index = this.items_.indexOf(item);
    if (index < 0) {
      return;
    }
    this.items_.splice(index, 1);
    item.emitter.off("change", this.onItemSelectedChange_);
    this.keepSelection_();
  }
  keepSelection_() {
    if (this.items_.length === 0) {
      this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
      this.empty.rawValue = true;
      return;
    }
    const firstSelIndex = this.items_.findIndex((s) => s.rawValue);
    if (firstSelIndex < 0) {
      this.items_.forEach((s, i) => {
        s.rawValue = i === 0;
      });
      this.selectedIndex.rawValue = 0;
    } else {
      this.items_.forEach((s, i) => {
        s.rawValue = i === firstSelIndex;
      });
      this.selectedIndex.rawValue = firstSelIndex;
    }
    this.empty.rawValue = false;
  }
  onItemSelectedChange_(ev) {
    if (ev.rawValue) {
      const index = this.items_.findIndex((s) => s === ev.sender);
      this.items_.forEach((s, i) => {
        s.rawValue = i === index;
      });
      this.selectedIndex.rawValue = index;
    } else {
      this.keepSelection_();
    }
  }
};
var cn$l = ClassName("tab");
var TabView = class {
  static {
    __name(this, "TabView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$l(), bladeContainerClassName());
    config.viewProps.bindClassModifiers(this.element);
    bindValue(config.empty, valueToClassName(this.element, cn$l(void 0, "nop")));
    const titleElem = doc.createElement("div");
    titleElem.classList.add(cn$l("t"));
    this.element.appendChild(titleElem);
    this.itemsElement = titleElem;
    const indentElem = doc.createElement("div");
    indentElem.classList.add(cn$l("i"));
    this.element.appendChild(indentElem);
    const contentsElem = doc.createElement("div");
    contentsElem.classList.add(cn$l("c"));
    this.element.appendChild(contentsElem);
    this.contentsElement = contentsElem;
  }
};
var TabController = class extends ContainerBladeController {
  static {
    __name(this, "TabController");
  }
  constructor(doc, config) {
    const tab = new Tab();
    const view = new TabView(doc, {
      empty: tab.empty,
      viewProps: config.viewProps
    });
    super({
      blade: config.blade,
      rackController: new RackController({
        blade: config.blade,
        element: view.contentsElement,
        viewProps: config.viewProps
      }),
      view
    });
    this.onRackAdd_ = this.onRackAdd_.bind(this);
    this.onRackRemove_ = this.onRackRemove_.bind(this);
    const rack = this.rackController.rack;
    rack.emitter.on("add", this.onRackAdd_);
    rack.emitter.on("remove", this.onRackRemove_);
    this.tab = tab;
  }
  add(pc, opt_index) {
    this.rackController.rack.add(pc, opt_index);
  }
  remove(index) {
    this.rackController.rack.remove(this.rackController.rack.children[index]);
  }
  onRackAdd_(ev) {
    if (!ev.root) {
      return;
    }
    const pc = ev.bladeController;
    insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
    pc.itemController.viewProps.set("parent", this.viewProps);
    this.tab.add(pc.props.value("selected"));
  }
  onRackRemove_(ev) {
    if (!ev.root) {
      return;
    }
    const pc = ev.bladeController;
    removeElement(pc.itemController.view.element);
    pc.itemController.viewProps.set("parent", null);
    this.tab.remove(pc.props.value("selected"));
  }
};
var TabBladePlugin = createPlugin({
  id: "tab",
  type: "blade",
  accept(params) {
    const result = parseRecord(params, (p) => ({
      pages: p.required.array(p.required.object({ title: p.required.string })),
      view: p.required.constant("tab")
    }));
    if (!result || result.pages.length === 0) {
      return null;
    }
    return { params: result };
  },
  controller(args) {
    const c = new TabController(args.document, {
      blade: args.blade,
      viewProps: args.viewProps
    });
    args.params.pages.forEach((p) => {
      const pc = new TabPageController(args.document, {
        blade: createBlade(),
        itemProps: ValueMap.fromObject({
          selected: false,
          title: p.title
        }),
        props: ValueMap.fromObject({
          selected: false
        }),
        viewProps: ViewProps.create()
      });
      c.add(pc);
    });
    return c;
  },
  api(args) {
    if (args.controller instanceof TabController) {
      return new TabApi(args.controller, args.pool);
    }
    if (args.controller instanceof TabPageController) {
      return new TabPageApi(args.controller, args.pool);
    }
    return null;
  }
});
function createBladeController(plugin, args) {
  const ac = plugin.accept(args.params);
  if (!ac) {
    return null;
  }
  const params = parseRecord(args.params, (p) => ({
    disabled: p.optional.boolean,
    hidden: p.optional.boolean
  }));
  return plugin.controller({
    blade: createBlade(),
    document: args.document,
    params: forceCast(Object.assign(Object.assign({}, ac.params), { disabled: params === null || params === void 0 ? void 0 : params.disabled, hidden: params === null || params === void 0 ? void 0 : params.hidden })),
    viewProps: ViewProps.create({
      disabled: params === null || params === void 0 ? void 0 : params.disabled,
      hidden: params === null || params === void 0 ? void 0 : params.hidden
    })
  });
}
__name(createBladeController, "createBladeController");
var ListInputBindingApi = class extends BindingApi {
  static {
    __name(this, "ListInputBindingApi");
  }
  get options() {
    return this.controller.valueController.props.get("options");
  }
  set options(options) {
    this.controller.valueController.props.set("options", options);
  }
};
var ManualTicker = class {
  static {
    __name(this, "ManualTicker");
  }
  constructor() {
    this.disabled = false;
    this.emitter = new Emitter();
  }
  dispose() {
  }
  tick() {
    if (this.disabled) {
      return;
    }
    this.emitter.emit("tick", {
      sender: this
    });
  }
};
var IntervalTicker = class {
  static {
    __name(this, "IntervalTicker");
  }
  constructor(doc, interval) {
    this.disabled_ = false;
    this.timerId_ = null;
    this.onTick_ = this.onTick_.bind(this);
    this.doc_ = doc;
    this.emitter = new Emitter();
    this.interval_ = interval;
    this.setTimer_();
  }
  get disabled() {
    return this.disabled_;
  }
  set disabled(inactive) {
    this.disabled_ = inactive;
    if (this.disabled_) {
      this.clearTimer_();
    } else {
      this.setTimer_();
    }
  }
  dispose() {
    this.clearTimer_();
  }
  clearTimer_() {
    if (this.timerId_ === null) {
      return;
    }
    const win = this.doc_.defaultView;
    if (win) {
      win.clearInterval(this.timerId_);
    }
    this.timerId_ = null;
  }
  setTimer_() {
    this.clearTimer_();
    if (this.interval_ <= 0) {
      return;
    }
    const win = this.doc_.defaultView;
    if (win) {
      this.timerId_ = win.setInterval(this.onTick_, this.interval_);
    }
  }
  onTick_() {
    if (this.disabled_) {
      return;
    }
    this.emitter.emit("tick", {
      sender: this
    });
  }
};
var CompositeConstraint = class {
  static {
    __name(this, "CompositeConstraint");
  }
  constructor(constraints) {
    this.constraints = constraints;
  }
  constrain(value) {
    return this.constraints.reduce((result, c) => {
      return c.constrain(result);
    }, value);
  }
};
function findConstraint(c, constraintClass) {
  if (c instanceof constraintClass) {
    return c;
  }
  if (c instanceof CompositeConstraint) {
    const result = c.constraints.reduce((tmpResult, sc) => {
      if (tmpResult) {
        return tmpResult;
      }
      return sc instanceof constraintClass ? sc : null;
    }, null);
    if (result) {
      return result;
    }
  }
  return null;
}
__name(findConstraint, "findConstraint");
var ListConstraint = class {
  static {
    __name(this, "ListConstraint");
  }
  constructor(options) {
    this.values = ValueMap.fromObject({
      options
    });
  }
  constrain(value) {
    const opts = this.values.get("options");
    if (opts.length === 0) {
      return value;
    }
    const matched = opts.filter((item) => {
      return item.value === value;
    }).length > 0;
    return matched ? value : opts[0].value;
  }
};
function parseListOptions(value) {
  var _a;
  const p = MicroParsers;
  if (Array.isArray(value)) {
    return (_a = parseRecord({ items: value }, (p2) => ({
      items: p2.required.array(p2.required.object({
        text: p2.required.string,
        value: p2.required.raw
      }))
    }))) === null || _a === void 0 ? void 0 : _a.items;
  }
  if (typeof value === "object") {
    return p.required.raw(value).value;
  }
  return void 0;
}
__name(parseListOptions, "parseListOptions");
function normalizeListOptions(options) {
  if (Array.isArray(options)) {
    return options;
  }
  const items = [];
  Object.keys(options).forEach((text) => {
    items.push({ text, value: options[text] });
  });
  return items;
}
__name(normalizeListOptions, "normalizeListOptions");
function createListConstraint(options) {
  return !isEmpty(options) ? new ListConstraint(normalizeListOptions(forceCast(options))) : null;
}
__name(createListConstraint, "createListConstraint");
var cn$k = ClassName("lst");
var ListView = class {
  static {
    __name(this, "ListView");
  }
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.props_ = config.props;
    this.element = doc.createElement("div");
    this.element.classList.add(cn$k());
    config.viewProps.bindClassModifiers(this.element);
    const selectElem = doc.createElement("select");
    selectElem.classList.add(cn$k("s"));
    config.viewProps.bindDisabled(selectElem);
    this.element.appendChild(selectElem);
    this.selectElement = selectElem;
    const markElem = doc.createElement("div");
    markElem.classList.add(cn$k("m"));
    markElem.appendChild(createSvgIconElement(doc, "dropdown"));
    this.element.appendChild(markElem);
    config.value.emitter.on("change", this.onValueChange_);
    this.value_ = config.value;
    bindValueMap(this.props_, "options", (opts) => {
      removeChildElements(this.selectElement);
      opts.forEach((item) => {
        const optionElem = doc.createElement("option");
        optionElem.textContent = item.text;
        this.selectElement.appendChild(optionElem);
      });
      this.update_();
    });
  }
  update_() {
    const values = this.props_.get("options").map((o) => o.value);
    this.selectElement.selectedIndex = values.indexOf(this.value_.rawValue);
  }
  onValueChange_() {
    this.update_();
  }
};
var ListController = class {
  static {
    __name(this, "ListController");
  }
  constructor(doc, config) {
    this.onSelectChange_ = this.onSelectChange_.bind(this);
    this.props = config.props;
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new ListView(doc, {
      props: this.props,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.selectElement.addEventListener("change", this.onSelectChange_);
  }
  onSelectChange_(e) {
    const selectElem = forceCast(e.currentTarget);
    this.value.rawValue = this.props.get("options")[selectElem.selectedIndex].value;
  }
  importProps(state) {
    return importBladeState(state, null, (p) => ({
      options: p.required.custom(parseListOptions)
    }), (result) => {
      this.props.set("options", normalizeListOptions(result.options));
      return true;
    });
  }
  exportProps() {
    return exportBladeState(null, {
      options: this.props.get("options")
    });
  }
};
var cn$j = ClassName("pop");
var PopupView = class {
  static {
    __name(this, "PopupView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$j());
    config.viewProps.bindClassModifiers(this.element);
    bindValue(config.shows, valueToClassName(this.element, cn$j(void 0, "v")));
  }
};
var PopupController = class {
  static {
    __name(this, "PopupController");
  }
  constructor(doc, config) {
    this.shows = createValue(false);
    this.viewProps = config.viewProps;
    this.view = new PopupView(doc, {
      shows: this.shows,
      viewProps: this.viewProps
    });
  }
};
var cn$i = ClassName("txt");
var TextView = class {
  static {
    __name(this, "TextView");
  }
  constructor(doc, config) {
    this.onChange_ = this.onChange_.bind(this);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$i());
    config.viewProps.bindClassModifiers(this.element);
    this.props_ = config.props;
    this.props_.emitter.on("change", this.onChange_);
    const inputElem = doc.createElement("input");
    inputElem.classList.add(cn$i("i"));
    inputElem.type = "text";
    config.viewProps.bindDisabled(inputElem);
    this.element.appendChild(inputElem);
    this.inputElement = inputElem;
    config.value.emitter.on("change", this.onChange_);
    this.value_ = config.value;
    this.refresh();
  }
  refresh() {
    const formatter = this.props_.get("formatter");
    this.inputElement.value = formatter(this.value_.rawValue);
  }
  onChange_() {
    this.refresh();
  }
};
var TextController = class {
  static {
    __name(this, "TextController");
  }
  constructor(doc, config) {
    this.onInputChange_ = this.onInputChange_.bind(this);
    this.parser_ = config.parser;
    this.props = config.props;
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new TextView(doc, {
      props: config.props,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.inputElement.addEventListener("change", this.onInputChange_);
  }
  onInputChange_(e) {
    const inputElem = forceCast(e.currentTarget);
    const value = inputElem.value;
    const parsedValue = this.parser_(value);
    if (!isEmpty(parsedValue)) {
      this.value.rawValue = parsedValue;
    }
    this.view.refresh();
  }
};
function boolToString(value) {
  return String(value);
}
__name(boolToString, "boolToString");
function boolFromUnknown(value) {
  if (value === "false") {
    return false;
  }
  return !!value;
}
__name(boolFromUnknown, "boolFromUnknown");
function BooleanFormatter(value) {
  return boolToString(value);
}
__name(BooleanFormatter, "BooleanFormatter");
function composeParsers(parsers) {
  return (text) => {
    return parsers.reduce((result, parser) => {
      if (result !== null) {
        return result;
      }
      return parser(text);
    }, null);
  };
}
__name(composeParsers, "composeParsers");
var innerFormatter = createNumberFormatter(0);
function formatPercentage(value) {
  return innerFormatter(value) + "%";
}
__name(formatPercentage, "formatPercentage");
function stringFromUnknown(value) {
  return String(value);
}
__name(stringFromUnknown, "stringFromUnknown");
function formatString(value) {
  return value;
}
__name(formatString, "formatString");
function connectValues({ primary, secondary, forward, backward }) {
  let changing = false;
  function preventFeedback(callback) {
    if (changing) {
      return;
    }
    changing = true;
    callback();
    changing = false;
  }
  __name(preventFeedback, "preventFeedback");
  primary.emitter.on("change", (ev) => {
    preventFeedback(() => {
      secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
    });
  });
  secondary.emitter.on("change", (ev) => {
    preventFeedback(() => {
      primary.setRawValue(backward(primary.rawValue, secondary.rawValue), ev.options);
    });
    preventFeedback(() => {
      secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), ev.options);
    });
  });
  preventFeedback(() => {
    secondary.setRawValue(forward(primary.rawValue, secondary.rawValue), {
      forceEmit: false,
      last: true
    });
  });
}
__name(connectValues, "connectValues");
function getStepForKey(keyScale, keys) {
  const step = keyScale * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
  if (keys.upKey) {
    return +step;
  } else if (keys.downKey) {
    return -step;
  }
  return 0;
}
__name(getStepForKey, "getStepForKey");
function getVerticalStepKeys(ev) {
  return {
    altKey: ev.altKey,
    downKey: ev.key === "ArrowDown",
    shiftKey: ev.shiftKey,
    upKey: ev.key === "ArrowUp"
  };
}
__name(getVerticalStepKeys, "getVerticalStepKeys");
function getHorizontalStepKeys(ev) {
  return {
    altKey: ev.altKey,
    downKey: ev.key === "ArrowLeft",
    shiftKey: ev.shiftKey,
    upKey: ev.key === "ArrowRight"
  };
}
__name(getHorizontalStepKeys, "getHorizontalStepKeys");
function isVerticalArrowKey(key) {
  return key === "ArrowUp" || key === "ArrowDown";
}
__name(isVerticalArrowKey, "isVerticalArrowKey");
function isArrowKey(key) {
  return isVerticalArrowKey(key) || key === "ArrowLeft" || key === "ArrowRight";
}
__name(isArrowKey, "isArrowKey");
function computeOffset$1(ev, elem) {
  var _a, _b;
  const win = elem.ownerDocument.defaultView;
  const rect = elem.getBoundingClientRect();
  return {
    x: ev.pageX - (((_a = win && win.scrollX) !== null && _a !== void 0 ? _a : 0) + rect.left),
    y: ev.pageY - (((_b = win && win.scrollY) !== null && _b !== void 0 ? _b : 0) + rect.top)
  };
}
__name(computeOffset$1, "computeOffset$1");
var PointerHandler = class {
  static {
    __name(this, "PointerHandler");
  }
  constructor(element) {
    this.lastTouch_ = null;
    this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
    this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
    this.onMouseDown_ = this.onMouseDown_.bind(this);
    this.onTouchEnd_ = this.onTouchEnd_.bind(this);
    this.onTouchMove_ = this.onTouchMove_.bind(this);
    this.onTouchStart_ = this.onTouchStart_.bind(this);
    this.elem_ = element;
    this.emitter = new Emitter();
    element.addEventListener("touchstart", this.onTouchStart_, {
      passive: false
    });
    element.addEventListener("touchmove", this.onTouchMove_, {
      passive: true
    });
    element.addEventListener("touchend", this.onTouchEnd_);
    element.addEventListener("mousedown", this.onMouseDown_);
  }
  computePosition_(offset) {
    const rect = this.elem_.getBoundingClientRect();
    return {
      bounds: {
        width: rect.width,
        height: rect.height
      },
      point: offset ? {
        x: offset.x,
        y: offset.y
      } : null
    };
  }
  onMouseDown_(ev) {
    var _a;
    ev.preventDefault();
    (_a = ev.currentTarget) === null || _a === void 0 ? void 0 : _a.focus();
    const doc = this.elem_.ownerDocument;
    doc.addEventListener("mousemove", this.onDocumentMouseMove_);
    doc.addEventListener("mouseup", this.onDocumentMouseUp_);
    this.emitter.emit("down", {
      altKey: ev.altKey,
      data: this.computePosition_(computeOffset$1(ev, this.elem_)),
      sender: this,
      shiftKey: ev.shiftKey
    });
  }
  onDocumentMouseMove_(ev) {
    this.emitter.emit("move", {
      altKey: ev.altKey,
      data: this.computePosition_(computeOffset$1(ev, this.elem_)),
      sender: this,
      shiftKey: ev.shiftKey
    });
  }
  onDocumentMouseUp_(ev) {
    const doc = this.elem_.ownerDocument;
    doc.removeEventListener("mousemove", this.onDocumentMouseMove_);
    doc.removeEventListener("mouseup", this.onDocumentMouseUp_);
    this.emitter.emit("up", {
      altKey: ev.altKey,
      data: this.computePosition_(computeOffset$1(ev, this.elem_)),
      sender: this,
      shiftKey: ev.shiftKey
    });
  }
  onTouchStart_(ev) {
    ev.preventDefault();
    const touch = ev.targetTouches.item(0);
    const rect = this.elem_.getBoundingClientRect();
    this.emitter.emit("down", {
      altKey: ev.altKey,
      data: this.computePosition_(touch ? {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      } : void 0),
      sender: this,
      shiftKey: ev.shiftKey
    });
    this.lastTouch_ = touch;
  }
  onTouchMove_(ev) {
    const touch = ev.targetTouches.item(0);
    const rect = this.elem_.getBoundingClientRect();
    this.emitter.emit("move", {
      altKey: ev.altKey,
      data: this.computePosition_(touch ? {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      } : void 0),
      sender: this,
      shiftKey: ev.shiftKey
    });
    this.lastTouch_ = touch;
  }
  onTouchEnd_(ev) {
    var _a;
    const touch = (_a = ev.targetTouches.item(0)) !== null && _a !== void 0 ? _a : this.lastTouch_;
    const rect = this.elem_.getBoundingClientRect();
    this.emitter.emit("up", {
      altKey: ev.altKey,
      data: this.computePosition_(touch ? {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      } : void 0),
      sender: this,
      shiftKey: ev.shiftKey
    });
  }
};
var cn$h = ClassName("txt");
var NumberTextView = class {
  static {
    __name(this, "NumberTextView");
  }
  constructor(doc, config) {
    this.onChange_ = this.onChange_.bind(this);
    this.props_ = config.props;
    this.props_.emitter.on("change", this.onChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$h(), cn$h(void 0, "num"));
    if (config.arrayPosition) {
      this.element.classList.add(cn$h(void 0, config.arrayPosition));
    }
    config.viewProps.bindClassModifiers(this.element);
    const inputElem = doc.createElement("input");
    inputElem.classList.add(cn$h("i"));
    inputElem.type = "text";
    config.viewProps.bindDisabled(inputElem);
    this.element.appendChild(inputElem);
    this.inputElement = inputElem;
    this.onDraggingChange_ = this.onDraggingChange_.bind(this);
    this.dragging_ = config.dragging;
    this.dragging_.emitter.on("change", this.onDraggingChange_);
    this.element.classList.add(cn$h());
    this.inputElement.classList.add(cn$h("i"));
    const knobElem = doc.createElement("div");
    knobElem.classList.add(cn$h("k"));
    this.element.appendChild(knobElem);
    this.knobElement = knobElem;
    const guideElem = doc.createElementNS(SVG_NS, "svg");
    guideElem.classList.add(cn$h("g"));
    this.knobElement.appendChild(guideElem);
    const bodyElem = doc.createElementNS(SVG_NS, "path");
    bodyElem.classList.add(cn$h("gb"));
    guideElem.appendChild(bodyElem);
    this.guideBodyElem_ = bodyElem;
    const headElem = doc.createElementNS(SVG_NS, "path");
    headElem.classList.add(cn$h("gh"));
    guideElem.appendChild(headElem);
    this.guideHeadElem_ = headElem;
    const tooltipElem = doc.createElement("div");
    tooltipElem.classList.add(ClassName("tt")());
    this.knobElement.appendChild(tooltipElem);
    this.tooltipElem_ = tooltipElem;
    config.value.emitter.on("change", this.onChange_);
    this.value = config.value;
    this.refresh();
  }
  onDraggingChange_(ev) {
    if (ev.rawValue === null) {
      this.element.classList.remove(cn$h(void 0, "drg"));
      return;
    }
    this.element.classList.add(cn$h(void 0, "drg"));
    const x = ev.rawValue / this.props_.get("pointerScale");
    const aox = x + (x > 0 ? -1 : x < 0 ? 1 : 0);
    const adx = constrainRange(-aox, -4, 4);
    this.guideHeadElem_.setAttributeNS(null, "d", [`M ${aox + adx},0 L${aox},4 L${aox + adx},8`, `M ${x},-1 L${x},9`].join(" "));
    this.guideBodyElem_.setAttributeNS(null, "d", `M 0,4 L${x},4`);
    const formatter = this.props_.get("formatter");
    this.tooltipElem_.textContent = formatter(this.value.rawValue);
    this.tooltipElem_.style.left = `${x}px`;
  }
  refresh() {
    const formatter = this.props_.get("formatter");
    this.inputElement.value = formatter(this.value.rawValue);
  }
  onChange_() {
    this.refresh();
  }
};
var NumberTextController = class {
  static {
    __name(this, "NumberTextController");
  }
  constructor(doc, config) {
    var _a;
    this.originRawValue_ = 0;
    this.onInputChange_ = this.onInputChange_.bind(this);
    this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
    this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.parser_ = config.parser;
    this.props = config.props;
    this.sliderProps_ = (_a = config.sliderProps) !== null && _a !== void 0 ? _a : null;
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.dragging_ = createValue(null);
    this.view = new NumberTextView(doc, {
      arrayPosition: config.arrayPosition,
      dragging: this.dragging_,
      props: this.props,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.inputElement.addEventListener("change", this.onInputChange_);
    this.view.inputElement.addEventListener("keydown", this.onInputKeyDown_);
    this.view.inputElement.addEventListener("keyup", this.onInputKeyUp_);
    const ph = new PointerHandler(this.view.knobElement);
    ph.emitter.on("down", this.onPointerDown_);
    ph.emitter.on("move", this.onPointerMove_);
    ph.emitter.on("up", this.onPointerUp_);
  }
  constrainValue_(value) {
    var _a, _b;
    const min = (_a = this.sliderProps_) === null || _a === void 0 ? void 0 : _a.get("min");
    const max = (_b = this.sliderProps_) === null || _b === void 0 ? void 0 : _b.get("max");
    let v = value;
    if (min !== void 0) {
      v = Math.max(v, min);
    }
    if (max !== void 0) {
      v = Math.min(v, max);
    }
    return v;
  }
  onInputChange_(e) {
    const inputElem = forceCast(e.currentTarget);
    const value = inputElem.value;
    const parsedValue = this.parser_(value);
    if (!isEmpty(parsedValue)) {
      this.value.rawValue = this.constrainValue_(parsedValue);
    }
    this.view.refresh();
  }
  onInputKeyDown_(ev) {
    const step = getStepForKey(this.props.get("keyScale"), getVerticalStepKeys(ev));
    if (step === 0) {
      return;
    }
    this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
      forceEmit: false,
      last: false
    });
  }
  onInputKeyUp_(ev) {
    const step = getStepForKey(this.props.get("keyScale"), getVerticalStepKeys(ev));
    if (step === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
  onPointerDown_() {
    this.originRawValue_ = this.value.rawValue;
    this.dragging_.rawValue = 0;
  }
  computeDraggingValue_(data) {
    if (!data.point) {
      return null;
    }
    const dx = data.point.x - data.bounds.width / 2;
    return this.constrainValue_(this.originRawValue_ + dx * this.props.get("pointerScale"));
  }
  onPointerMove_(ev) {
    const v = this.computeDraggingValue_(ev.data);
    if (v === null) {
      return;
    }
    this.value.setRawValue(v, {
      forceEmit: false,
      last: false
    });
    this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
  }
  onPointerUp_(ev) {
    const v = this.computeDraggingValue_(ev.data);
    if (v === null) {
      return;
    }
    this.value.setRawValue(v, {
      forceEmit: true,
      last: true
    });
    this.dragging_.rawValue = null;
  }
};
var cn$g = ClassName("sld");
var SliderView = class {
  static {
    __name(this, "SliderView");
  }
  constructor(doc, config) {
    this.onChange_ = this.onChange_.bind(this);
    this.props_ = config.props;
    this.props_.emitter.on("change", this.onChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$g());
    config.viewProps.bindClassModifiers(this.element);
    const trackElem = doc.createElement("div");
    trackElem.classList.add(cn$g("t"));
    config.viewProps.bindTabIndex(trackElem);
    this.element.appendChild(trackElem);
    this.trackElement = trackElem;
    const knobElem = doc.createElement("div");
    knobElem.classList.add(cn$g("k"));
    this.trackElement.appendChild(knobElem);
    this.knobElement = knobElem;
    config.value.emitter.on("change", this.onChange_);
    this.value = config.value;
    this.update_();
  }
  update_() {
    const p = constrainRange(mapRange(this.value.rawValue, this.props_.get("min"), this.props_.get("max"), 0, 100), 0, 100);
    this.knobElement.style.width = `${p}%`;
  }
  onChange_() {
    this.update_();
  }
};
var SliderController = class {
  static {
    __name(this, "SliderController");
  }
  constructor(doc, config) {
    this.onKeyDown_ = this.onKeyDown_.bind(this);
    this.onKeyUp_ = this.onKeyUp_.bind(this);
    this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.props = config.props;
    this.view = new SliderView(doc, {
      props: this.props,
      value: this.value,
      viewProps: this.viewProps
    });
    this.ptHandler_ = new PointerHandler(this.view.trackElement);
    this.ptHandler_.emitter.on("down", this.onPointerDownOrMove_);
    this.ptHandler_.emitter.on("move", this.onPointerDownOrMove_);
    this.ptHandler_.emitter.on("up", this.onPointerUp_);
    this.view.trackElement.addEventListener("keydown", this.onKeyDown_);
    this.view.trackElement.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(d, opts) {
    if (!d.point) {
      return;
    }
    this.value.setRawValue(mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, this.props.get("min"), this.props.get("max")), opts);
  }
  onPointerDownOrMove_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: true,
      last: true
    });
  }
  onKeyDown_(ev) {
    const step = getStepForKey(this.props.get("keyScale"), getHorizontalStepKeys(ev));
    if (step === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue + step, {
      forceEmit: false,
      last: false
    });
  }
  onKeyUp_(ev) {
    const step = getStepForKey(this.props.get("keyScale"), getHorizontalStepKeys(ev));
    if (step === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
};
var cn$f = ClassName("sldtxt");
var SliderTextView = class {
  static {
    __name(this, "SliderTextView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$f());
    const sliderElem = doc.createElement("div");
    sliderElem.classList.add(cn$f("s"));
    this.sliderView_ = config.sliderView;
    sliderElem.appendChild(this.sliderView_.element);
    this.element.appendChild(sliderElem);
    const textElem = doc.createElement("div");
    textElem.classList.add(cn$f("t"));
    this.textView_ = config.textView;
    textElem.appendChild(this.textView_.element);
    this.element.appendChild(textElem);
  }
};
var SliderTextController = class {
  static {
    __name(this, "SliderTextController");
  }
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.sliderC_ = new SliderController(doc, {
      props: config.sliderProps,
      value: config.value,
      viewProps: this.viewProps
    });
    this.textC_ = new NumberTextController(doc, {
      parser: config.parser,
      props: config.textProps,
      sliderProps: config.sliderProps,
      value: config.value,
      viewProps: config.viewProps
    });
    this.view = new SliderTextView(doc, {
      sliderView: this.sliderC_.view,
      textView: this.textC_.view
    });
  }
  get sliderController() {
    return this.sliderC_;
  }
  get textController() {
    return this.textC_;
  }
  importProps(state) {
    return importBladeState(state, null, (p) => ({
      max: p.required.number,
      min: p.required.number
    }), (result) => {
      const sliderProps = this.sliderC_.props;
      sliderProps.set("max", result.max);
      sliderProps.set("min", result.min);
      return true;
    });
  }
  exportProps() {
    const sliderProps = this.sliderC_.props;
    return exportBladeState(null, {
      max: sliderProps.get("max"),
      min: sliderProps.get("min")
    });
  }
};
function createSliderTextProps(config) {
  return {
    sliderProps: new ValueMap({
      keyScale: config.keyScale,
      max: config.max,
      min: config.min
    }),
    textProps: new ValueMap({
      formatter: createValue(config.formatter),
      keyScale: config.keyScale,
      pointerScale: createValue(config.pointerScale)
    })
  };
}
__name(createSliderTextProps, "createSliderTextProps");
var CSS_VAR_MAP = {
  containerUnitSize: "cnt-usz"
};
function getCssVar(key) {
  return `--${CSS_VAR_MAP[key]}`;
}
__name(getCssVar, "getCssVar");
function createPointDimensionParser(p) {
  return createNumberTextInputParamsParser(p);
}
__name(createPointDimensionParser, "createPointDimensionParser");
function parsePointDimensionParams(value) {
  if (!isRecord(value)) {
    return void 0;
  }
  return parseRecord(value, createPointDimensionParser);
}
__name(parsePointDimensionParams, "parsePointDimensionParams");
function createDimensionConstraint(params, initialValue) {
  if (!params) {
    return void 0;
  }
  const constraints = [];
  const cs = createStepConstraint(params, initialValue);
  if (cs) {
    constraints.push(cs);
  }
  const rs = createRangeConstraint(params);
  if (rs) {
    constraints.push(rs);
  }
  return new CompositeConstraint(constraints);
}
__name(createDimensionConstraint, "createDimensionConstraint");
function isCompatible(ver) {
  if (!ver) {
    return false;
  }
  return ver.major === VERSION$1.major;
}
__name(isCompatible, "isCompatible");
function parsePickerLayout(value) {
  if (value === "inline" || value === "popup") {
    return value;
  }
  return void 0;
}
__name(parsePickerLayout, "parsePickerLayout");
function writePrimitive(target, value) {
  target.write(value);
}
__name(writePrimitive, "writePrimitive");
var cn$e = ClassName("ckb");
var CheckboxView = class {
  static {
    __name(this, "CheckboxView");
  }
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$e());
    config.viewProps.bindClassModifiers(this.element);
    const labelElem = doc.createElement("label");
    labelElem.classList.add(cn$e("l"));
    this.element.appendChild(labelElem);
    this.labelElement = labelElem;
    const inputElem = doc.createElement("input");
    inputElem.classList.add(cn$e("i"));
    inputElem.type = "checkbox";
    this.labelElement.appendChild(inputElem);
    this.inputElement = inputElem;
    config.viewProps.bindDisabled(this.inputElement);
    const wrapperElem = doc.createElement("div");
    wrapperElem.classList.add(cn$e("w"));
    this.labelElement.appendChild(wrapperElem);
    const markElem = createSvgIconElement(doc, "check");
    wrapperElem.appendChild(markElem);
    config.value.emitter.on("change", this.onValueChange_);
    this.value = config.value;
    this.update_();
  }
  update_() {
    this.inputElement.checked = this.value.rawValue;
  }
  onValueChange_() {
    this.update_();
  }
};
var CheckboxController = class {
  static {
    __name(this, "CheckboxController");
  }
  constructor(doc, config) {
    this.onInputChange_ = this.onInputChange_.bind(this);
    this.onLabelMouseDown_ = this.onLabelMouseDown_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new CheckboxView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.view.inputElement.addEventListener("change", this.onInputChange_);
    this.view.labelElement.addEventListener("mousedown", this.onLabelMouseDown_);
  }
  onInputChange_(ev) {
    const inputElem = forceCast(ev.currentTarget);
    this.value.rawValue = inputElem.checked;
    ev.preventDefault();
    ev.stopPropagation();
  }
  onLabelMouseDown_(ev) {
    ev.preventDefault();
  }
};
function createConstraint$6(params) {
  const constraints = [];
  const lc = createListConstraint(params.options);
  if (lc) {
    constraints.push(lc);
  }
  return new CompositeConstraint(constraints);
}
__name(createConstraint$6, "createConstraint$6");
var BooleanInputPlugin = createPlugin({
  id: "input-bool",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "boolean") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      options: p.optional.custom(parseListOptions),
      readonly: p.optional.constant(false)
    }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => boolFromUnknown, "reader"),
    constraint: /* @__PURE__ */ __name((args) => createConstraint$6(args.params), "constraint"),
    writer: /* @__PURE__ */ __name((_args) => writePrimitive, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    const doc = args.document;
    const value = args.value;
    const c = args.constraint;
    const lc = c && findConstraint(c, ListConstraint);
    if (lc) {
      return new ListController(doc, {
        props: new ValueMap({
          options: lc.values.value("options")
        }),
        value,
        viewProps: args.viewProps
      });
    }
    return new CheckboxController(doc, {
      value,
      viewProps: args.viewProps
    });
  }, "controller"),
  api(args) {
    if (typeof args.controller.value.rawValue !== "boolean") {
      return null;
    }
    if (args.controller.valueController instanceof ListController) {
      return new ListInputBindingApi(args.controller);
    }
    return null;
  }
});
var cn$d = ClassName("col");
var ColorView = class {
  static {
    __name(this, "ColorView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$d());
    config.foldable.bindExpandedClass(this.element, cn$d(void 0, "expanded"));
    bindValueMap(config.foldable, "completed", valueToClassName(this.element, cn$d(void 0, "cpl")));
    const headElem = doc.createElement("div");
    headElem.classList.add(cn$d("h"));
    this.element.appendChild(headElem);
    const swatchElem = doc.createElement("div");
    swatchElem.classList.add(cn$d("s"));
    headElem.appendChild(swatchElem);
    this.swatchElement = swatchElem;
    const textElem = doc.createElement("div");
    textElem.classList.add(cn$d("t"));
    headElem.appendChild(textElem);
    this.textElement = textElem;
    if (config.pickerLayout === "inline") {
      const pickerElem = doc.createElement("div");
      pickerElem.classList.add(cn$d("p"));
      this.element.appendChild(pickerElem);
      this.pickerElement = pickerElem;
    } else {
      this.pickerElement = null;
    }
  }
};
function rgbToHslInt(r, g, b) {
  const rp = constrainRange(r / 255, 0, 1);
  const gp = constrainRange(g / 255, 0, 1);
  const bp = constrainRange(b / 255, 0, 1);
  const cmax = Math.max(rp, gp, bp);
  const cmin = Math.min(rp, gp, bp);
  const c = cmax - cmin;
  let h = 0;
  let s = 0;
  const l = (cmin + cmax) / 2;
  if (c !== 0) {
    s = c / (1 - Math.abs(cmax + cmin - 1));
    if (rp === cmax) {
      h = (gp - bp) / c;
    } else if (gp === cmax) {
      h = 2 + (bp - rp) / c;
    } else {
      h = 4 + (rp - gp) / c;
    }
    h = h / 6 + (h < 0 ? 1 : 0);
  }
  return [h * 360, s * 100, l * 100];
}
__name(rgbToHslInt, "rgbToHslInt");
function hslToRgbInt(h, s, l) {
  const hp = (h % 360 + 360) % 360;
  const sp = constrainRange(s / 100, 0, 1);
  const lp = constrainRange(l / 100, 0, 1);
  const c = (1 - Math.abs(2 * lp - 1)) * sp;
  const x = c * (1 - Math.abs(hp / 60 % 2 - 1));
  const m = lp - c / 2;
  let rp, gp, bp;
  if (hp >= 0 && hp < 60) {
    [rp, gp, bp] = [c, x, 0];
  } else if (hp >= 60 && hp < 120) {
    [rp, gp, bp] = [x, c, 0];
  } else if (hp >= 120 && hp < 180) {
    [rp, gp, bp] = [0, c, x];
  } else if (hp >= 180 && hp < 240) {
    [rp, gp, bp] = [0, x, c];
  } else if (hp >= 240 && hp < 300) {
    [rp, gp, bp] = [x, 0, c];
  } else {
    [rp, gp, bp] = [c, 0, x];
  }
  return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}
__name(hslToRgbInt, "hslToRgbInt");
function rgbToHsvInt(r, g, b) {
  const rp = constrainRange(r / 255, 0, 1);
  const gp = constrainRange(g / 255, 0, 1);
  const bp = constrainRange(b / 255, 0, 1);
  const cmax = Math.max(rp, gp, bp);
  const cmin = Math.min(rp, gp, bp);
  const d = cmax - cmin;
  let h;
  if (d === 0) {
    h = 0;
  } else if (cmax === rp) {
    h = 60 * (((gp - bp) / d % 6 + 6) % 6);
  } else if (cmax === gp) {
    h = 60 * ((bp - rp) / d + 2);
  } else {
    h = 60 * ((rp - gp) / d + 4);
  }
  const s = cmax === 0 ? 0 : d / cmax;
  const v = cmax;
  return [h, s * 100, v * 100];
}
__name(rgbToHsvInt, "rgbToHsvInt");
function hsvToRgbInt(h, s, v) {
  const hp = loopRange(h, 360);
  const sp = constrainRange(s / 100, 0, 1);
  const vp = constrainRange(v / 100, 0, 1);
  const c = vp * sp;
  const x = c * (1 - Math.abs(hp / 60 % 2 - 1));
  const m = vp - c;
  let rp, gp, bp;
  if (hp >= 0 && hp < 60) {
    [rp, gp, bp] = [c, x, 0];
  } else if (hp >= 60 && hp < 120) {
    [rp, gp, bp] = [x, c, 0];
  } else if (hp >= 120 && hp < 180) {
    [rp, gp, bp] = [0, c, x];
  } else if (hp >= 180 && hp < 240) {
    [rp, gp, bp] = [0, x, c];
  } else if (hp >= 240 && hp < 300) {
    [rp, gp, bp] = [x, 0, c];
  } else {
    [rp, gp, bp] = [c, 0, x];
  }
  return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}
__name(hsvToRgbInt, "hsvToRgbInt");
function hslToHsvInt(h, s, l) {
  const sd = l + s * (100 - Math.abs(2 * l - 100)) / (2 * 100);
  return [
    h,
    sd !== 0 ? s * (100 - Math.abs(2 * l - 100)) / sd : 0,
    l + s * (100 - Math.abs(2 * l - 100)) / (2 * 100)
  ];
}
__name(hslToHsvInt, "hslToHsvInt");
function hsvToHslInt(h, s, v) {
  const sd = 100 - Math.abs(v * (200 - s) / 100 - 100);
  return [h, sd !== 0 ? s * v / sd : 0, v * (200 - s) / (2 * 100)];
}
__name(hsvToHslInt, "hsvToHslInt");
function removeAlphaComponent(comps) {
  return [comps[0], comps[1], comps[2]];
}
__name(removeAlphaComponent, "removeAlphaComponent");
function appendAlphaComponent(comps, alpha) {
  return [comps[0], comps[1], comps[2], alpha];
}
__name(appendAlphaComponent, "appendAlphaComponent");
var MODE_CONVERTER_MAP = {
  hsl: {
    hsl: /* @__PURE__ */ __name((h, s, l) => [h, s, l], "hsl"),
    hsv: hslToHsvInt,
    rgb: hslToRgbInt
  },
  hsv: {
    hsl: hsvToHslInt,
    hsv: /* @__PURE__ */ __name((h, s, v) => [h, s, v], "hsv"),
    rgb: hsvToRgbInt
  },
  rgb: {
    hsl: rgbToHslInt,
    hsv: rgbToHsvInt,
    rgb: /* @__PURE__ */ __name((r, g, b) => [r, g, b], "rgb")
  }
};
function getColorMaxComponents(mode, type) {
  return [
    type === "float" ? 1 : mode === "rgb" ? 255 : 360,
    type === "float" ? 1 : mode === "rgb" ? 255 : 100,
    type === "float" ? 1 : mode === "rgb" ? 255 : 100
  ];
}
__name(getColorMaxComponents, "getColorMaxComponents");
function loopHueRange(hue, max) {
  return hue === max ? max : loopRange(hue, max);
}
__name(loopHueRange, "loopHueRange");
function constrainColorComponents(components, mode, type) {
  var _a;
  const ms = getColorMaxComponents(mode, type);
  return [
    mode === "rgb" ? constrainRange(components[0], 0, ms[0]) : loopHueRange(components[0], ms[0]),
    constrainRange(components[1], 0, ms[1]),
    constrainRange(components[2], 0, ms[2]),
    constrainRange((_a = components[3]) !== null && _a !== void 0 ? _a : 1, 0, 1)
  ];
}
__name(constrainColorComponents, "constrainColorComponents");
function convertColorType(comps, mode, from, to) {
  const fms = getColorMaxComponents(mode, from);
  const tms = getColorMaxComponents(mode, to);
  return comps.map((c, index) => c / fms[index] * tms[index]);
}
__name(convertColorType, "convertColorType");
function convertColor(components, from, to) {
  const intComps = convertColorType(components, from.mode, from.type, "int");
  const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
  return convertColorType(result, to.mode, "int", to.type);
}
__name(convertColor, "convertColor");
var IntColor = class _IntColor {
  static {
    __name(this, "IntColor");
  }
  static black() {
    return new _IntColor([0, 0, 0], "rgb");
  }
  constructor(comps, mode) {
    this.type = "int";
    this.mode = mode;
    this.comps_ = constrainColorComponents(comps, mode, this.type);
  }
  getComponents(opt_mode) {
    return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
  }
  toRgbaObject() {
    const rgbComps = this.getComponents("rgb");
    return {
      r: rgbComps[0],
      g: rgbComps[1],
      b: rgbComps[2],
      a: rgbComps[3]
    };
  }
};
var cn$c = ClassName("colp");
var ColorPickerView = class {
  static {
    __name(this, "ColorPickerView");
  }
  constructor(doc, config) {
    this.alphaViews_ = null;
    this.element = doc.createElement("div");
    this.element.classList.add(cn$c());
    config.viewProps.bindClassModifiers(this.element);
    const hsvElem = doc.createElement("div");
    hsvElem.classList.add(cn$c("hsv"));
    const svElem = doc.createElement("div");
    svElem.classList.add(cn$c("sv"));
    this.svPaletteView_ = config.svPaletteView;
    svElem.appendChild(this.svPaletteView_.element);
    hsvElem.appendChild(svElem);
    const hElem = doc.createElement("div");
    hElem.classList.add(cn$c("h"));
    this.hPaletteView_ = config.hPaletteView;
    hElem.appendChild(this.hPaletteView_.element);
    hsvElem.appendChild(hElem);
    this.element.appendChild(hsvElem);
    const rgbElem = doc.createElement("div");
    rgbElem.classList.add(cn$c("rgb"));
    this.textsView_ = config.textsView;
    rgbElem.appendChild(this.textsView_.element);
    this.element.appendChild(rgbElem);
    if (config.alphaViews) {
      this.alphaViews_ = {
        palette: config.alphaViews.palette,
        text: config.alphaViews.text
      };
      const aElem = doc.createElement("div");
      aElem.classList.add(cn$c("a"));
      const apElem = doc.createElement("div");
      apElem.classList.add(cn$c("ap"));
      apElem.appendChild(this.alphaViews_.palette.element);
      aElem.appendChild(apElem);
      const atElem = doc.createElement("div");
      atElem.classList.add(cn$c("at"));
      atElem.appendChild(this.alphaViews_.text.element);
      aElem.appendChild(atElem);
      this.element.appendChild(aElem);
    }
  }
  get allFocusableElements() {
    const elems = [
      this.svPaletteView_.element,
      this.hPaletteView_.element,
      this.textsView_.modeSelectElement,
      ...this.textsView_.inputViews.map((v) => v.inputElement)
    ];
    if (this.alphaViews_) {
      elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
    }
    return elems;
  }
};
function parseColorType(value) {
  return value === "int" ? "int" : value === "float" ? "float" : void 0;
}
__name(parseColorType, "parseColorType");
function parseColorInputParams(params) {
  return parseRecord(params, (p) => ({
    color: p.optional.object({
      alpha: p.optional.boolean,
      type: p.optional.custom(parseColorType)
    }),
    expanded: p.optional.boolean,
    picker: p.optional.custom(parsePickerLayout),
    readonly: p.optional.constant(false)
  }));
}
__name(parseColorInputParams, "parseColorInputParams");
function getKeyScaleForColor(forAlpha) {
  return forAlpha ? 0.1 : 1;
}
__name(getKeyScaleForColor, "getKeyScaleForColor");
function extractColorType(params) {
  var _a;
  return (_a = params.color) === null || _a === void 0 ? void 0 : _a.type;
}
__name(extractColorType, "extractColorType");
var FloatColor = class {
  static {
    __name(this, "FloatColor");
  }
  constructor(comps, mode) {
    this.type = "float";
    this.mode = mode;
    this.comps_ = constrainColorComponents(comps, mode, this.type);
  }
  getComponents(opt_mode) {
    return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type: this.type }), this.comps_[3]);
  }
  toRgbaObject() {
    const rgbComps = this.getComponents("rgb");
    return {
      r: rgbComps[0],
      g: rgbComps[1],
      b: rgbComps[2],
      a: rgbComps[3]
    };
  }
};
var TYPE_TO_CONSTRUCTOR_MAP = {
  int: /* @__PURE__ */ __name((comps, mode) => new IntColor(comps, mode), "int"),
  float: /* @__PURE__ */ __name((comps, mode) => new FloatColor(comps, mode), "float")
};
function createColor(comps, mode, type) {
  return TYPE_TO_CONSTRUCTOR_MAP[type](comps, mode);
}
__name(createColor, "createColor");
function isFloatColor(c) {
  return c.type === "float";
}
__name(isFloatColor, "isFloatColor");
function isIntColor(c) {
  return c.type === "int";
}
__name(isIntColor, "isIntColor");
function convertFloatToInt(cf) {
  const comps = cf.getComponents();
  const ms = getColorMaxComponents(cf.mode, "int");
  return new IntColor([
    Math.round(mapRange(comps[0], 0, 1, 0, ms[0])),
    Math.round(mapRange(comps[1], 0, 1, 0, ms[1])),
    Math.round(mapRange(comps[2], 0, 1, 0, ms[2])),
    comps[3]
  ], cf.mode);
}
__name(convertFloatToInt, "convertFloatToInt");
function convertIntToFloat(ci) {
  const comps = ci.getComponents();
  const ms = getColorMaxComponents(ci.mode, "int");
  return new FloatColor([
    mapRange(comps[0], 0, ms[0], 0, 1),
    mapRange(comps[1], 0, ms[1], 0, 1),
    mapRange(comps[2], 0, ms[2], 0, 1),
    comps[3]
  ], ci.mode);
}
__name(convertIntToFloat, "convertIntToFloat");
function mapColorType(c, type) {
  if (c.type === type) {
    return c;
  }
  if (isIntColor(c) && type === "float") {
    return convertIntToFloat(c);
  }
  if (isFloatColor(c) && type === "int") {
    return convertFloatToInt(c);
  }
  throw TpError.shouldNeverHappen();
}
__name(mapColorType, "mapColorType");
function equalsStringColorFormat(f1, f2) {
  return f1.alpha === f2.alpha && f1.mode === f2.mode && f1.notation === f2.notation && f1.type === f2.type;
}
__name(equalsStringColorFormat, "equalsStringColorFormat");
function parseCssNumberOrPercentage(text, max) {
  const m = text.match(/^(.+)%$/);
  if (!m) {
    return Math.min(parseFloat(text), max);
  }
  return Math.min(parseFloat(m[1]) * 0.01 * max, max);
}
__name(parseCssNumberOrPercentage, "parseCssNumberOrPercentage");
var ANGLE_TO_DEG_MAP = {
  deg: /* @__PURE__ */ __name((angle) => angle, "deg"),
  grad: /* @__PURE__ */ __name((angle) => angle * 360 / 400, "grad"),
  rad: /* @__PURE__ */ __name((angle) => angle * 360 / (2 * Math.PI), "rad"),
  turn: /* @__PURE__ */ __name((angle) => angle * 360, "turn")
};
function parseCssNumberOrAngle(text) {
  const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
  if (!m) {
    return parseFloat(text);
  }
  const angle = parseFloat(m[1]);
  const unit = m[2];
  return ANGLE_TO_DEG_MAP[unit](angle);
}
__name(parseCssNumberOrAngle, "parseCssNumberOrAngle");
function parseFunctionalRgbColorComponents(text) {
  const m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!m) {
    return null;
  }
  const comps = [
    parseCssNumberOrPercentage(m[1], 255),
    parseCssNumberOrPercentage(m[2], 255),
    parseCssNumberOrPercentage(m[3], 255)
  ];
  if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
    return null;
  }
  return comps;
}
__name(parseFunctionalRgbColorComponents, "parseFunctionalRgbColorComponents");
function parseFunctionalRgbColor(text) {
  const comps = parseFunctionalRgbColorComponents(text);
  return comps ? new IntColor(comps, "rgb") : null;
}
__name(parseFunctionalRgbColor, "parseFunctionalRgbColor");
function parseFunctionalRgbaColorComponents(text) {
  const m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!m) {
    return null;
  }
  const comps = [
    parseCssNumberOrPercentage(m[1], 255),
    parseCssNumberOrPercentage(m[2], 255),
    parseCssNumberOrPercentage(m[3], 255),
    parseCssNumberOrPercentage(m[4], 1)
  ];
  if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
    return null;
  }
  return comps;
}
__name(parseFunctionalRgbaColorComponents, "parseFunctionalRgbaColorComponents");
function parseFunctionalRgbaColor(text) {
  const comps = parseFunctionalRgbaColorComponents(text);
  return comps ? new IntColor(comps, "rgb") : null;
}
__name(parseFunctionalRgbaColor, "parseFunctionalRgbaColor");
function parseFunctionalHslColorComponents(text) {
  const m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!m) {
    return null;
  }
  const comps = [
    parseCssNumberOrAngle(m[1]),
    parseCssNumberOrPercentage(m[2], 100),
    parseCssNumberOrPercentage(m[3], 100)
  ];
  if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
    return null;
  }
  return comps;
}
__name(parseFunctionalHslColorComponents, "parseFunctionalHslColorComponents");
function parseFunctionalHslColor(text) {
  const comps = parseFunctionalHslColorComponents(text);
  return comps ? new IntColor(comps, "hsl") : null;
}
__name(parseFunctionalHslColor, "parseFunctionalHslColor");
function parseHslaColorComponents(text) {
  const m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!m) {
    return null;
  }
  const comps = [
    parseCssNumberOrAngle(m[1]),
    parseCssNumberOrPercentage(m[2], 100),
    parseCssNumberOrPercentage(m[3], 100),
    parseCssNumberOrPercentage(m[4], 1)
  ];
  if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
    return null;
  }
  return comps;
}
__name(parseHslaColorComponents, "parseHslaColorComponents");
function parseFunctionalHslaColor(text) {
  const comps = parseHslaColorComponents(text);
  return comps ? new IntColor(comps, "hsl") : null;
}
__name(parseFunctionalHslaColor, "parseFunctionalHslaColor");
function parseHexRgbColorComponents(text) {
  const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
  if (mRgb) {
    return [
      parseInt(mRgb[1] + mRgb[1], 16),
      parseInt(mRgb[2] + mRgb[2], 16),
      parseInt(mRgb[3] + mRgb[3], 16)
    ];
  }
  const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
  if (mRrggbb) {
    return [
      parseInt(mRrggbb[1], 16),
      parseInt(mRrggbb[2], 16),
      parseInt(mRrggbb[3], 16)
    ];
  }
  return null;
}
__name(parseHexRgbColorComponents, "parseHexRgbColorComponents");
function parseHexRgbColor(text) {
  const comps = parseHexRgbColorComponents(text);
  return comps ? new IntColor(comps, "rgb") : null;
}
__name(parseHexRgbColor, "parseHexRgbColor");
function parseHexRgbaColorComponents(text) {
  const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
  if (mRgb) {
    return [
      parseInt(mRgb[1] + mRgb[1], 16),
      parseInt(mRgb[2] + mRgb[2], 16),
      parseInt(mRgb[3] + mRgb[3], 16),
      mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1)
    ];
  }
  const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
  if (mRrggbb) {
    return [
      parseInt(mRrggbb[1], 16),
      parseInt(mRrggbb[2], 16),
      parseInt(mRrggbb[3], 16),
      mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1)
    ];
  }
  return null;
}
__name(parseHexRgbaColorComponents, "parseHexRgbaColorComponents");
function parseHexRgbaColor(text) {
  const comps = parseHexRgbaColorComponents(text);
  return comps ? new IntColor(comps, "rgb") : null;
}
__name(parseHexRgbaColor, "parseHexRgbaColor");
function parseObjectRgbColorComponents(text) {
  const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
  if (!m) {
    return null;
  }
  const comps = [
    parseFloat(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3])
  ];
  if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
    return null;
  }
  return comps;
}
__name(parseObjectRgbColorComponents, "parseObjectRgbColorComponents");
function createObjectRgbColorParser(type) {
  return (text) => {
    const comps = parseObjectRgbColorComponents(text);
    return comps ? createColor(comps, "rgb", type) : null;
  };
}
__name(createObjectRgbColorParser, "createObjectRgbColorParser");
function parseObjectRgbaColorComponents(text) {
  const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
  if (!m) {
    return null;
  }
  const comps = [
    parseFloat(m[1]),
    parseFloat(m[2]),
    parseFloat(m[3]),
    parseFloat(m[4])
  ];
  if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2]) || isNaN(comps[3])) {
    return null;
  }
  return comps;
}
__name(parseObjectRgbaColorComponents, "parseObjectRgbaColorComponents");
function createObjectRgbaColorParser(type) {
  return (text) => {
    const comps = parseObjectRgbaColorComponents(text);
    return comps ? createColor(comps, "rgb", type) : null;
  };
}
__name(createObjectRgbaColorParser, "createObjectRgbaColorParser");
var PARSER_AND_RESULT = [
  {
    parser: parseHexRgbColorComponents,
    result: {
      alpha: false,
      mode: "rgb",
      notation: "hex"
    }
  },
  {
    parser: parseHexRgbaColorComponents,
    result: {
      alpha: true,
      mode: "rgb",
      notation: "hex"
    }
  },
  {
    parser: parseFunctionalRgbColorComponents,
    result: {
      alpha: false,
      mode: "rgb",
      notation: "func"
    }
  },
  {
    parser: parseFunctionalRgbaColorComponents,
    result: {
      alpha: true,
      mode: "rgb",
      notation: "func"
    }
  },
  {
    parser: parseFunctionalHslColorComponents,
    result: {
      alpha: false,
      mode: "hsl",
      notation: "func"
    }
  },
  {
    parser: parseHslaColorComponents,
    result: {
      alpha: true,
      mode: "hsl",
      notation: "func"
    }
  },
  {
    parser: parseObjectRgbColorComponents,
    result: {
      alpha: false,
      mode: "rgb",
      notation: "object"
    }
  },
  {
    parser: parseObjectRgbaColorComponents,
    result: {
      alpha: true,
      mode: "rgb",
      notation: "object"
    }
  }
];
function detectStringColor(text) {
  return PARSER_AND_RESULT.reduce((prev, { parser, result: detection }) => {
    if (prev) {
      return prev;
    }
    return parser(text) ? detection : null;
  }, null);
}
__name(detectStringColor, "detectStringColor");
function detectStringColorFormat(text, type = "int") {
  const r = detectStringColor(text);
  if (!r) {
    return null;
  }
  if (r.notation === "hex" && type !== "float") {
    return Object.assign(Object.assign({}, r), { type: "int" });
  }
  if (r.notation === "func") {
    return Object.assign(Object.assign({}, r), { type });
  }
  return null;
}
__name(detectStringColorFormat, "detectStringColorFormat");
function createColorStringParser(type) {
  const parsers = [
    parseHexRgbColor,
    parseHexRgbaColor,
    parseFunctionalRgbColor,
    parseFunctionalRgbaColor,
    parseFunctionalHslColor,
    parseFunctionalHslaColor
  ];
  if (type === "int") {
    parsers.push(createObjectRgbColorParser("int"), createObjectRgbaColorParser("int"));
  }
  if (type === "float") {
    parsers.push(createObjectRgbColorParser("float"), createObjectRgbaColorParser("float"));
  }
  const parser = composeParsers(parsers);
  return (text) => {
    const result = parser(text);
    return result ? mapColorType(result, type) : null;
  };
}
__name(createColorStringParser, "createColorStringParser");
function readIntColorString(value) {
  const parser = createColorStringParser("int");
  if (typeof value !== "string") {
    return IntColor.black();
  }
  const result = parser(value);
  return result !== null && result !== void 0 ? result : IntColor.black();
}
__name(readIntColorString, "readIntColorString");
function zerofill(comp) {
  const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}
__name(zerofill, "zerofill");
function colorToHexRgbString(value, prefix = "#") {
  const hexes = removeAlphaComponent(value.getComponents("rgb")).map(zerofill).join("");
  return `${prefix}${hexes}`;
}
__name(colorToHexRgbString, "colorToHexRgbString");
function colorToHexRgbaString(value, prefix = "#") {
  const rgbaComps = value.getComponents("rgb");
  const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255].map(zerofill).join("");
  return `${prefix}${hexes}`;
}
__name(colorToHexRgbaString, "colorToHexRgbaString");
function colorToFunctionalRgbString(value) {
  const formatter = createNumberFormatter(0);
  const ci = mapColorType(value, "int");
  const comps = removeAlphaComponent(ci.getComponents("rgb")).map((comp) => formatter(comp));
  return `rgb(${comps.join(", ")})`;
}
__name(colorToFunctionalRgbString, "colorToFunctionalRgbString");
function colorToFunctionalRgbaString(value) {
  const aFormatter = createNumberFormatter(2);
  const rgbFormatter = createNumberFormatter(0);
  const ci = mapColorType(value, "int");
  const comps = ci.getComponents("rgb").map((comp, index) => {
    const formatter = index === 3 ? aFormatter : rgbFormatter;
    return formatter(comp);
  });
  return `rgba(${comps.join(", ")})`;
}
__name(colorToFunctionalRgbaString, "colorToFunctionalRgbaString");
function colorToFunctionalHslString(value) {
  const formatters = [
    createNumberFormatter(0),
    formatPercentage,
    formatPercentage
  ];
  const ci = mapColorType(value, "int");
  const comps = removeAlphaComponent(ci.getComponents("hsl")).map((comp, index) => formatters[index](comp));
  return `hsl(${comps.join(", ")})`;
}
__name(colorToFunctionalHslString, "colorToFunctionalHslString");
function colorToFunctionalHslaString(value) {
  const formatters = [
    createNumberFormatter(0),
    formatPercentage,
    formatPercentage,
    createNumberFormatter(2)
  ];
  const ci = mapColorType(value, "int");
  const comps = ci.getComponents("hsl").map((comp, index) => formatters[index](comp));
  return `hsla(${comps.join(", ")})`;
}
__name(colorToFunctionalHslaString, "colorToFunctionalHslaString");
function colorToObjectRgbString(value, type) {
  const formatter = createNumberFormatter(type === "float" ? 2 : 0);
  const names = ["r", "g", "b"];
  const cc = mapColorType(value, type);
  const comps = removeAlphaComponent(cc.getComponents("rgb")).map((comp, index) => `${names[index]}: ${formatter(comp)}`);
  return `{${comps.join(", ")}}`;
}
__name(colorToObjectRgbString, "colorToObjectRgbString");
function createObjectRgbColorFormatter(type) {
  return (value) => colorToObjectRgbString(value, type);
}
__name(createObjectRgbColorFormatter, "createObjectRgbColorFormatter");
function colorToObjectRgbaString(value, type) {
  const aFormatter = createNumberFormatter(2);
  const rgbFormatter = createNumberFormatter(type === "float" ? 2 : 0);
  const names = ["r", "g", "b", "a"];
  const cc = mapColorType(value, type);
  const comps = cc.getComponents("rgb").map((comp, index) => {
    const formatter = index === 3 ? aFormatter : rgbFormatter;
    return `${names[index]}: ${formatter(comp)}`;
  });
  return `{${comps.join(", ")}}`;
}
__name(colorToObjectRgbaString, "colorToObjectRgbaString");
function createObjectRgbaColorFormatter(type) {
  return (value) => colorToObjectRgbaString(value, type);
}
__name(createObjectRgbaColorFormatter, "createObjectRgbaColorFormatter");
var FORMAT_AND_STRINGIFIERS = [
  {
    format: {
      alpha: false,
      mode: "rgb",
      notation: "hex",
      type: "int"
    },
    stringifier: colorToHexRgbString
  },
  {
    format: {
      alpha: true,
      mode: "rgb",
      notation: "hex",
      type: "int"
    },
    stringifier: colorToHexRgbaString
  },
  {
    format: {
      alpha: false,
      mode: "rgb",
      notation: "func",
      type: "int"
    },
    stringifier: colorToFunctionalRgbString
  },
  {
    format: {
      alpha: true,
      mode: "rgb",
      notation: "func",
      type: "int"
    },
    stringifier: colorToFunctionalRgbaString
  },
  {
    format: {
      alpha: false,
      mode: "hsl",
      notation: "func",
      type: "int"
    },
    stringifier: colorToFunctionalHslString
  },
  {
    format: {
      alpha: true,
      mode: "hsl",
      notation: "func",
      type: "int"
    },
    stringifier: colorToFunctionalHslaString
  },
  ...["int", "float"].reduce((prev, type) => {
    return [
      ...prev,
      {
        format: {
          alpha: false,
          mode: "rgb",
          notation: "object",
          type
        },
        stringifier: createObjectRgbColorFormatter(type)
      },
      {
        format: {
          alpha: true,
          mode: "rgb",
          notation: "object",
          type
        },
        stringifier: createObjectRgbaColorFormatter(type)
      }
    ];
  }, [])
];
function findColorStringifier(format) {
  return FORMAT_AND_STRINGIFIERS.reduce((prev, fas) => {
    if (prev) {
      return prev;
    }
    return equalsStringColorFormat(fas.format, format) ? fas.stringifier : null;
  }, null);
}
__name(findColorStringifier, "findColorStringifier");
var cn$b = ClassName("apl");
var APaletteView = class {
  static {
    __name(this, "APaletteView");
  }
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.value = config.value;
    this.value.emitter.on("change", this.onValueChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$b());
    config.viewProps.bindClassModifiers(this.element);
    config.viewProps.bindTabIndex(this.element);
    const barElem = doc.createElement("div");
    barElem.classList.add(cn$b("b"));
    this.element.appendChild(barElem);
    const colorElem = doc.createElement("div");
    colorElem.classList.add(cn$b("c"));
    barElem.appendChild(colorElem);
    this.colorElem_ = colorElem;
    const markerElem = doc.createElement("div");
    markerElem.classList.add(cn$b("m"));
    this.element.appendChild(markerElem);
    this.markerElem_ = markerElem;
    const previewElem = doc.createElement("div");
    previewElem.classList.add(cn$b("p"));
    this.markerElem_.appendChild(previewElem);
    this.previewElem_ = previewElem;
    this.update_();
  }
  update_() {
    const c = this.value.rawValue;
    const rgbaComps = c.getComponents("rgb");
    const leftColor = new IntColor([rgbaComps[0], rgbaComps[1], rgbaComps[2], 0], "rgb");
    const rightColor = new IntColor([rgbaComps[0], rgbaComps[1], rgbaComps[2], 255], "rgb");
    const gradientComps = [
      "to right",
      colorToFunctionalRgbaString(leftColor),
      colorToFunctionalRgbaString(rightColor)
    ];
    this.colorElem_.style.background = `linear-gradient(${gradientComps.join(",")})`;
    this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
    const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
    this.markerElem_.style.left = `${left}%`;
  }
  onValueChange_() {
    this.update_();
  }
};
var APaletteController = class {
  static {
    __name(this, "APaletteController");
  }
  constructor(doc, config) {
    this.onKeyDown_ = this.onKeyDown_.bind(this);
    this.onKeyUp_ = this.onKeyUp_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new APaletteView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.ptHandler_ = new PointerHandler(this.view.element);
    this.ptHandler_.emitter.on("down", this.onPointerDown_);
    this.ptHandler_.emitter.on("move", this.onPointerMove_);
    this.ptHandler_.emitter.on("up", this.onPointerUp_);
    this.view.element.addEventListener("keydown", this.onKeyDown_);
    this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(d, opts) {
    if (!d.point) {
      return;
    }
    const alpha = d.point.x / d.bounds.width;
    const c = this.value.rawValue;
    const [h, s, v] = c.getComponents("hsv");
    this.value.setRawValue(new IntColor([h, s, v, alpha], "hsv"), opts);
  }
  onPointerDown_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerMove_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: true,
      last: true
    });
  }
  onKeyDown_(ev) {
    const step = getStepForKey(getKeyScaleForColor(true), getHorizontalStepKeys(ev));
    if (step === 0) {
      return;
    }
    const c = this.value.rawValue;
    const [h, s, v, a] = c.getComponents("hsv");
    this.value.setRawValue(new IntColor([h, s, v, a + step], "hsv"), {
      forceEmit: false,
      last: false
    });
  }
  onKeyUp_(ev) {
    const step = getStepForKey(getKeyScaleForColor(true), getHorizontalStepKeys(ev));
    if (step === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
};
var cn$a = ClassName("coltxt");
function createModeSelectElement(doc) {
  const selectElem = doc.createElement("select");
  const items = [
    { text: "RGB", value: "rgb" },
    { text: "HSL", value: "hsl" },
    { text: "HSV", value: "hsv" },
    { text: "HEX", value: "hex" }
  ];
  selectElem.appendChild(items.reduce((frag, item) => {
    const optElem = doc.createElement("option");
    optElem.textContent = item.text;
    optElem.value = item.value;
    frag.appendChild(optElem);
    return frag;
  }, doc.createDocumentFragment()));
  return selectElem;
}
__name(createModeSelectElement, "createModeSelectElement");
var ColorTextsView = class {
  static {
    __name(this, "ColorTextsView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$a());
    config.viewProps.bindClassModifiers(this.element);
    const modeElem = doc.createElement("div");
    modeElem.classList.add(cn$a("m"));
    this.modeElem_ = createModeSelectElement(doc);
    this.modeElem_.classList.add(cn$a("ms"));
    modeElem.appendChild(this.modeSelectElement);
    config.viewProps.bindDisabled(this.modeElem_);
    const modeMarkerElem = doc.createElement("div");
    modeMarkerElem.classList.add(cn$a("mm"));
    modeMarkerElem.appendChild(createSvgIconElement(doc, "dropdown"));
    modeElem.appendChild(modeMarkerElem);
    this.element.appendChild(modeElem);
    const inputsElem = doc.createElement("div");
    inputsElem.classList.add(cn$a("w"));
    this.element.appendChild(inputsElem);
    this.inputsElem_ = inputsElem;
    this.inputViews_ = config.inputViews;
    this.applyInputViews_();
    bindValue(config.mode, (mode) => {
      this.modeElem_.value = mode;
    });
  }
  get modeSelectElement() {
    return this.modeElem_;
  }
  get inputViews() {
    return this.inputViews_;
  }
  set inputViews(inputViews) {
    this.inputViews_ = inputViews;
    this.applyInputViews_();
  }
  applyInputViews_() {
    removeChildElements(this.inputsElem_);
    const doc = this.element.ownerDocument;
    this.inputViews_.forEach((v) => {
      const compElem = doc.createElement("div");
      compElem.classList.add(cn$a("c"));
      compElem.appendChild(v.element);
      this.inputsElem_.appendChild(compElem);
    });
  }
};
function createFormatter$2(type) {
  return createNumberFormatter(type === "float" ? 2 : 0);
}
__name(createFormatter$2, "createFormatter$2");
function createConstraint$5(mode, type, index) {
  const max = getColorMaxComponents(mode, type)[index];
  return new DefiniteRangeConstraint({
    min: 0,
    max
  });
}
__name(createConstraint$5, "createConstraint$5");
function createComponentController(doc, config, index) {
  return new NumberTextController(doc, {
    arrayPosition: index === 0 ? "fst" : index === 3 - 1 ? "lst" : "mid",
    parser: config.parser,
    props: ValueMap.fromObject({
      formatter: createFormatter$2(config.colorType),
      keyScale: getKeyScaleForColor(false),
      pointerScale: config.colorType === "float" ? 0.01 : 1
    }),
    value: createValue(0, {
      constraint: createConstraint$5(config.colorMode, config.colorType, index)
    }),
    viewProps: config.viewProps
  });
}
__name(createComponentController, "createComponentController");
function createComponentControllers(doc, config) {
  const cc = {
    colorMode: config.colorMode,
    colorType: config.colorType,
    parser: parseNumber,
    viewProps: config.viewProps
  };
  return [0, 1, 2].map((i) => {
    const c = createComponentController(doc, cc, i);
    connectValues({
      primary: config.value,
      secondary: c.value,
      forward(p) {
        const mc = mapColorType(p, config.colorType);
        return mc.getComponents(config.colorMode)[i];
      },
      backward(p, s) {
        const pickedMode = config.colorMode;
        const mc = mapColorType(p, config.colorType);
        const comps = mc.getComponents(pickedMode);
        comps[i] = s;
        const c2 = createColor(appendAlphaComponent(removeAlphaComponent(comps), comps[3]), pickedMode, config.colorType);
        return mapColorType(c2, "int");
      }
    });
    return c;
  });
}
__name(createComponentControllers, "createComponentControllers");
function createHexController(doc, config) {
  const c = new TextController(doc, {
    parser: createColorStringParser("int"),
    props: ValueMap.fromObject({
      formatter: colorToHexRgbString
    }),
    value: createValue(IntColor.black()),
    viewProps: config.viewProps
  });
  connectValues({
    primary: config.value,
    secondary: c.value,
    forward: /* @__PURE__ */ __name((p) => new IntColor(removeAlphaComponent(p.getComponents()), p.mode), "forward"),
    backward: /* @__PURE__ */ __name((p, s) => new IntColor(appendAlphaComponent(removeAlphaComponent(s.getComponents(p.mode)), p.getComponents()[3]), p.mode), "backward")
  });
  return [c];
}
__name(createHexController, "createHexController");
function isColorMode(mode) {
  return mode !== "hex";
}
__name(isColorMode, "isColorMode");
var ColorTextsController = class {
  static {
    __name(this, "ColorTextsController");
  }
  constructor(doc, config) {
    this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
    this.colorType_ = config.colorType;
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.colorMode = createValue(this.value.rawValue.mode);
    this.ccs_ = this.createComponentControllers_(doc);
    this.view = new ColorTextsView(doc, {
      mode: this.colorMode,
      inputViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
      viewProps: this.viewProps
    });
    this.view.modeSelectElement.addEventListener("change", this.onModeSelectChange_);
  }
  createComponentControllers_(doc) {
    const mode = this.colorMode.rawValue;
    if (isColorMode(mode)) {
      return createComponentControllers(doc, {
        colorMode: mode,
        colorType: this.colorType_,
        value: this.value,
        viewProps: this.viewProps
      });
    }
    return createHexController(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
  }
  onModeSelectChange_(ev) {
    const selectElem = ev.currentTarget;
    this.colorMode.rawValue = selectElem.value;
    this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
    this.view.inputViews = this.ccs_.map((cc) => cc.view);
  }
};
var cn$9 = ClassName("hpl");
var HPaletteView = class {
  static {
    __name(this, "HPaletteView");
  }
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.value = config.value;
    this.value.emitter.on("change", this.onValueChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$9());
    config.viewProps.bindClassModifiers(this.element);
    config.viewProps.bindTabIndex(this.element);
    const colorElem = doc.createElement("div");
    colorElem.classList.add(cn$9("c"));
    this.element.appendChild(colorElem);
    const markerElem = doc.createElement("div");
    markerElem.classList.add(cn$9("m"));
    this.element.appendChild(markerElem);
    this.markerElem_ = markerElem;
    this.update_();
  }
  update_() {
    const c = this.value.rawValue;
    const [h] = c.getComponents("hsv");
    this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new IntColor([h, 100, 100], "hsv"));
    const left = mapRange(h, 0, 360, 0, 100);
    this.markerElem_.style.left = `${left}%`;
  }
  onValueChange_() {
    this.update_();
  }
};
var HPaletteController = class {
  static {
    __name(this, "HPaletteController");
  }
  constructor(doc, config) {
    this.onKeyDown_ = this.onKeyDown_.bind(this);
    this.onKeyUp_ = this.onKeyUp_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new HPaletteView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.ptHandler_ = new PointerHandler(this.view.element);
    this.ptHandler_.emitter.on("down", this.onPointerDown_);
    this.ptHandler_.emitter.on("move", this.onPointerMove_);
    this.ptHandler_.emitter.on("up", this.onPointerUp_);
    this.view.element.addEventListener("keydown", this.onKeyDown_);
    this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(d, opts) {
    if (!d.point) {
      return;
    }
    const hue = mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, 0, 360);
    const c = this.value.rawValue;
    const [, s, v, a] = c.getComponents("hsv");
    this.value.setRawValue(new IntColor([hue, s, v, a], "hsv"), opts);
  }
  onPointerDown_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerMove_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: true,
      last: true
    });
  }
  onKeyDown_(ev) {
    const step = getStepForKey(getKeyScaleForColor(false), getHorizontalStepKeys(ev));
    if (step === 0) {
      return;
    }
    const c = this.value.rawValue;
    const [h, s, v, a] = c.getComponents("hsv");
    this.value.setRawValue(new IntColor([h + step, s, v, a], "hsv"), {
      forceEmit: false,
      last: false
    });
  }
  onKeyUp_(ev) {
    const step = getStepForKey(getKeyScaleForColor(false), getHorizontalStepKeys(ev));
    if (step === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
};
var cn$8 = ClassName("svp");
var CANVAS_RESOL = 64;
var SvPaletteView = class {
  static {
    __name(this, "SvPaletteView");
  }
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.value = config.value;
    this.value.emitter.on("change", this.onValueChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$8());
    config.viewProps.bindClassModifiers(this.element);
    config.viewProps.bindTabIndex(this.element);
    const canvasElem = doc.createElement("canvas");
    canvasElem.height = CANVAS_RESOL;
    canvasElem.width = CANVAS_RESOL;
    canvasElem.classList.add(cn$8("c"));
    this.element.appendChild(canvasElem);
    this.canvasElement = canvasElem;
    const markerElem = doc.createElement("div");
    markerElem.classList.add(cn$8("m"));
    this.element.appendChild(markerElem);
    this.markerElem_ = markerElem;
    this.update_();
  }
  update_() {
    const ctx = getCanvasContext(this.canvasElement);
    if (!ctx) {
      return;
    }
    const c = this.value.rawValue;
    const hsvComps = c.getComponents("hsv");
    const width = this.canvasElement.width;
    const height = this.canvasElement.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let iy = 0; iy < height; iy++) {
      for (let ix = 0; ix < width; ix++) {
        const s = mapRange(ix, 0, width, 0, 100);
        const v = mapRange(iy, 0, height, 100, 0);
        const rgbComps = hsvToRgbInt(hsvComps[0], s, v);
        const i = (iy * width + ix) * 4;
        data[i] = rgbComps[0];
        data[i + 1] = rgbComps[1];
        data[i + 2] = rgbComps[2];
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const left = mapRange(hsvComps[1], 0, 100, 0, 100);
    this.markerElem_.style.left = `${left}%`;
    const top = mapRange(hsvComps[2], 0, 100, 100, 0);
    this.markerElem_.style.top = `${top}%`;
  }
  onValueChange_() {
    this.update_();
  }
};
var SvPaletteController = class {
  static {
    __name(this, "SvPaletteController");
  }
  constructor(doc, config) {
    this.onKeyDown_ = this.onKeyDown_.bind(this);
    this.onKeyUp_ = this.onKeyUp_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new SvPaletteView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.ptHandler_ = new PointerHandler(this.view.element);
    this.ptHandler_.emitter.on("down", this.onPointerDown_);
    this.ptHandler_.emitter.on("move", this.onPointerMove_);
    this.ptHandler_.emitter.on("up", this.onPointerUp_);
    this.view.element.addEventListener("keydown", this.onKeyDown_);
    this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(d, opts) {
    if (!d.point) {
      return;
    }
    const saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
    const value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);
    const [h, , , a] = this.value.rawValue.getComponents("hsv");
    this.value.setRawValue(new IntColor([h, saturation, value, a], "hsv"), opts);
  }
  onPointerDown_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerMove_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: true,
      last: true
    });
  }
  onKeyDown_(ev) {
    if (isArrowKey(ev.key)) {
      ev.preventDefault();
    }
    const [h, s, v, a] = this.value.rawValue.getComponents("hsv");
    const keyScale = getKeyScaleForColor(false);
    const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
    const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
    if (ds === 0 && dv === 0) {
      return;
    }
    this.value.setRawValue(new IntColor([h, s + ds, v + dv, a], "hsv"), {
      forceEmit: false,
      last: false
    });
  }
  onKeyUp_(ev) {
    const keyScale = getKeyScaleForColor(false);
    const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
    const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
    if (ds === 0 && dv === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
};
var ColorPickerController = class {
  static {
    __name(this, "ColorPickerController");
  }
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.hPaletteC_ = new HPaletteController(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.svPaletteC_ = new SvPaletteController(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    this.alphaIcs_ = config.supportsAlpha ? {
      palette: new APaletteController(doc, {
        value: this.value,
        viewProps: this.viewProps
      }),
      text: new NumberTextController(doc, {
        parser: parseNumber,
        props: ValueMap.fromObject({
          pointerScale: 0.01,
          keyScale: 0.1,
          formatter: createNumberFormatter(2)
        }),
        value: createValue(0, {
          constraint: new DefiniteRangeConstraint({ min: 0, max: 1 })
        }),
        viewProps: this.viewProps
      })
    } : null;
    if (this.alphaIcs_) {
      connectValues({
        primary: this.value,
        secondary: this.alphaIcs_.text.value,
        forward: /* @__PURE__ */ __name((p) => p.getComponents()[3], "forward"),
        backward: /* @__PURE__ */ __name((p, s) => {
          const comps = p.getComponents();
          comps[3] = s;
          return new IntColor(comps, p.mode);
        }, "backward")
      });
    }
    this.textsC_ = new ColorTextsController(doc, {
      colorType: config.colorType,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view = new ColorPickerView(doc, {
      alphaViews: this.alphaIcs_ ? {
        palette: this.alphaIcs_.palette.view,
        text: this.alphaIcs_.text.view
      } : null,
      hPaletteView: this.hPaletteC_.view,
      supportsAlpha: config.supportsAlpha,
      svPaletteView: this.svPaletteC_.view,
      textsView: this.textsC_.view,
      viewProps: this.viewProps
    });
  }
  get textsController() {
    return this.textsC_;
  }
};
var cn$7 = ClassName("colsw");
var ColorSwatchView = class {
  static {
    __name(this, "ColorSwatchView");
  }
  constructor(doc, config) {
    this.onValueChange_ = this.onValueChange_.bind(this);
    config.value.emitter.on("change", this.onValueChange_);
    this.value = config.value;
    this.element = doc.createElement("div");
    this.element.classList.add(cn$7());
    config.viewProps.bindClassModifiers(this.element);
    const swatchElem = doc.createElement("div");
    swatchElem.classList.add(cn$7("sw"));
    this.element.appendChild(swatchElem);
    this.swatchElem_ = swatchElem;
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(cn$7("b"));
    config.viewProps.bindDisabled(buttonElem);
    this.element.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    this.update_();
  }
  update_() {
    const value = this.value.rawValue;
    this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
  }
  onValueChange_() {
    this.update_();
  }
};
var ColorSwatchController = class {
  static {
    __name(this, "ColorSwatchController");
  }
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new ColorSwatchView(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
  }
};
var ColorController = class {
  static {
    __name(this, "ColorController");
  }
  constructor(doc, config) {
    this.onButtonBlur_ = this.onButtonBlur_.bind(this);
    this.onButtonClick_ = this.onButtonClick_.bind(this);
    this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
    this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.foldable_ = Foldable.create(config.expanded);
    this.swatchC_ = new ColorSwatchController(doc, {
      value: this.value,
      viewProps: this.viewProps
    });
    const buttonElem = this.swatchC_.view.buttonElement;
    buttonElem.addEventListener("blur", this.onButtonBlur_);
    buttonElem.addEventListener("click", this.onButtonClick_);
    this.textC_ = new TextController(doc, {
      parser: config.parser,
      props: ValueMap.fromObject({
        formatter: config.formatter
      }),
      value: this.value,
      viewProps: this.viewProps
    });
    this.view = new ColorView(doc, {
      foldable: this.foldable_,
      pickerLayout: config.pickerLayout
    });
    this.view.swatchElement.appendChild(this.swatchC_.view.element);
    this.view.textElement.appendChild(this.textC_.view.element);
    this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc, {
      viewProps: this.viewProps
    }) : null;
    const pickerC = new ColorPickerController(doc, {
      colorType: config.colorType,
      supportsAlpha: config.supportsAlpha,
      value: this.value,
      viewProps: this.viewProps
    });
    pickerC.view.allFocusableElements.forEach((elem) => {
      elem.addEventListener("blur", this.onPopupChildBlur_);
      elem.addEventListener("keydown", this.onPopupChildKeydown_);
    });
    this.pickerC_ = pickerC;
    if (this.popC_) {
      this.view.element.appendChild(this.popC_.view.element);
      this.popC_.view.element.appendChild(pickerC.view.element);
      connectValues({
        primary: this.foldable_.value("expanded"),
        secondary: this.popC_.shows,
        forward: /* @__PURE__ */ __name((p) => p, "forward"),
        backward: /* @__PURE__ */ __name((_, s) => s, "backward")
      });
    } else if (this.view.pickerElement) {
      this.view.pickerElement.appendChild(this.pickerC_.view.element);
      bindFoldable(this.foldable_, this.view.pickerElement);
    }
  }
  get textController() {
    return this.textC_;
  }
  onButtonBlur_(e) {
    if (!this.popC_) {
      return;
    }
    const elem = this.view.element;
    const nextTarget = forceCast(e.relatedTarget);
    if (!nextTarget || !elem.contains(nextTarget)) {
      this.popC_.shows.rawValue = false;
    }
  }
  onButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded"));
    if (this.foldable_.get("expanded")) {
      this.pickerC_.view.allFocusableElements[0].focus();
    }
  }
  onPopupChildBlur_(ev) {
    if (!this.popC_) {
      return;
    }
    const elem = this.popC_.view.element;
    const nextTarget = findNextTarget(ev);
    if (nextTarget && elem.contains(nextTarget)) {
      return;
    }
    if (nextTarget && nextTarget === this.swatchC_.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
      return;
    }
    this.popC_.shows.rawValue = false;
  }
  onPopupChildKeydown_(ev) {
    if (this.popC_) {
      if (ev.key === "Escape") {
        this.popC_.shows.rawValue = false;
      }
    } else if (this.view.pickerElement) {
      if (ev.key === "Escape") {
        this.swatchC_.view.buttonElement.focus();
      }
    }
  }
};
function colorToRgbNumber(value) {
  return removeAlphaComponent(value.getComponents("rgb")).reduce((result, comp) => {
    return result << 8 | Math.floor(comp) & 255;
  }, 0);
}
__name(colorToRgbNumber, "colorToRgbNumber");
function colorToRgbaNumber(value) {
  return value.getComponents("rgb").reduce((result, comp, index) => {
    const hex = Math.floor(index === 3 ? comp * 255 : comp) & 255;
    return result << 8 | hex;
  }, 0) >>> 0;
}
__name(colorToRgbaNumber, "colorToRgbaNumber");
function numberToRgbColor(num) {
  return new IntColor([num >> 16 & 255, num >> 8 & 255, num & 255], "rgb");
}
__name(numberToRgbColor, "numberToRgbColor");
function numberToRgbaColor(num) {
  return new IntColor([
    num >> 24 & 255,
    num >> 16 & 255,
    num >> 8 & 255,
    mapRange(num & 255, 0, 255, 0, 1)
  ], "rgb");
}
__name(numberToRgbaColor, "numberToRgbaColor");
function colorFromRgbNumber(value) {
  if (typeof value !== "number") {
    return IntColor.black();
  }
  return numberToRgbColor(value);
}
__name(colorFromRgbNumber, "colorFromRgbNumber");
function colorFromRgbaNumber(value) {
  if (typeof value !== "number") {
    return IntColor.black();
  }
  return numberToRgbaColor(value);
}
__name(colorFromRgbaNumber, "colorFromRgbaNumber");
function isRgbColorComponent(obj, key) {
  if (typeof obj !== "object" || isEmpty(obj)) {
    return false;
  }
  return key in obj && typeof obj[key] === "number";
}
__name(isRgbColorComponent, "isRgbColorComponent");
function isRgbColorObject(obj) {
  return isRgbColorComponent(obj, "r") && isRgbColorComponent(obj, "g") && isRgbColorComponent(obj, "b");
}
__name(isRgbColorObject, "isRgbColorObject");
function isRgbaColorObject(obj) {
  return isRgbColorObject(obj) && isRgbColorComponent(obj, "a");
}
__name(isRgbaColorObject, "isRgbaColorObject");
function isColorObject(obj) {
  return isRgbColorObject(obj);
}
__name(isColorObject, "isColorObject");
function equalsColor(v1, v2) {
  if (v1.mode !== v2.mode) {
    return false;
  }
  if (v1.type !== v2.type) {
    return false;
  }
  const comps1 = v1.getComponents();
  const comps2 = v2.getComponents();
  for (let i = 0; i < comps1.length; i++) {
    if (comps1[i] !== comps2[i]) {
      return false;
    }
  }
  return true;
}
__name(equalsColor, "equalsColor");
function createColorComponentsFromRgbObject(obj) {
  return "a" in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
}
__name(createColorComponentsFromRgbObject, "createColorComponentsFromRgbObject");
function createColorStringWriter(format) {
  const stringify = findColorStringifier(format);
  return stringify ? (target, value) => {
    writePrimitive(target, stringify(value));
  } : null;
}
__name(createColorStringWriter, "createColorStringWriter");
function createColorNumberWriter(supportsAlpha) {
  const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
  return (target, value) => {
    writePrimitive(target, colorToNumber(value));
  };
}
__name(createColorNumberWriter, "createColorNumberWriter");
function writeRgbaColorObject(target, value, type) {
  const cc = mapColorType(value, type);
  const obj = cc.toRgbaObject();
  target.writeProperty("r", obj.r);
  target.writeProperty("g", obj.g);
  target.writeProperty("b", obj.b);
  target.writeProperty("a", obj.a);
}
__name(writeRgbaColorObject, "writeRgbaColorObject");
function writeRgbColorObject(target, value, type) {
  const cc = mapColorType(value, type);
  const obj = cc.toRgbaObject();
  target.writeProperty("r", obj.r);
  target.writeProperty("g", obj.g);
  target.writeProperty("b", obj.b);
}
__name(writeRgbColorObject, "writeRgbColorObject");
function createColorObjectWriter(supportsAlpha, type) {
  return (target, inValue) => {
    if (supportsAlpha) {
      writeRgbaColorObject(target, inValue, type);
    } else {
      writeRgbColorObject(target, inValue, type);
    }
  };
}
__name(createColorObjectWriter, "createColorObjectWriter");
function shouldSupportAlpha$1(inputParams) {
  var _a;
  if ((_a = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a === void 0 ? void 0 : _a.alpha) {
    return true;
  }
  return false;
}
__name(shouldSupportAlpha$1, "shouldSupportAlpha$1");
function createFormatter$1(supportsAlpha) {
  return supportsAlpha ? (v) => colorToHexRgbaString(v, "0x") : (v) => colorToHexRgbString(v, "0x");
}
__name(createFormatter$1, "createFormatter$1");
function isForColor(params) {
  if ("color" in params) {
    return true;
  }
  if (params.view === "color") {
    return true;
  }
  return false;
}
__name(isForColor, "isForColor");
var NumberColorInputPlugin = createPlugin({
  id: "input-color-number",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "number") {
      return null;
    }
    if (!isForColor(params)) {
      return null;
    }
    const result = parseColorInputParams(params);
    return result ? {
      initialValue: value,
      params: Object.assign(Object.assign({}, result), { supportsAlpha: shouldSupportAlpha$1(params) })
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((args) => {
      return args.params.supportsAlpha ? colorFromRgbaNumber : colorFromRgbNumber;
    }, "reader"),
    equals: equalsColor,
    writer: /* @__PURE__ */ __name((args) => {
      return createColorNumberWriter(args.params.supportsAlpha);
    }, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    var _a, _b;
    return new ColorController(args.document, {
      colorType: "int",
      expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
      formatter: createFormatter$1(args.params.supportsAlpha),
      parser: createColorStringParser("int"),
      pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
      supportsAlpha: args.params.supportsAlpha,
      value: args.value,
      viewProps: args.viewProps
    });
  }, "controller")
});
function colorFromObject(value, type) {
  if (!isColorObject(value)) {
    return mapColorType(IntColor.black(), type);
  }
  if (type === "int") {
    const comps = createColorComponentsFromRgbObject(value);
    return new IntColor(comps, "rgb");
  }
  if (type === "float") {
    const comps = createColorComponentsFromRgbObject(value);
    return new FloatColor(comps, "rgb");
  }
  return mapColorType(IntColor.black(), "int");
}
__name(colorFromObject, "colorFromObject");
function shouldSupportAlpha(initialValue) {
  return isRgbaColorObject(initialValue);
}
__name(shouldSupportAlpha, "shouldSupportAlpha");
function createColorObjectBindingReader(type) {
  return (value) => {
    const c = colorFromObject(value, type);
    return mapColorType(c, "int");
  };
}
__name(createColorObjectBindingReader, "createColorObjectBindingReader");
function createColorObjectFormatter(supportsAlpha, type) {
  return (value) => {
    if (supportsAlpha) {
      return colorToObjectRgbaString(value, type);
    }
    return colorToObjectRgbString(value, type);
  };
}
__name(createColorObjectFormatter, "createColorObjectFormatter");
var ObjectColorInputPlugin = createPlugin({
  id: "input-color-object",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    var _a;
    if (!isColorObject(value)) {
      return null;
    }
    const result = parseColorInputParams(params);
    return result ? {
      initialValue: value,
      params: Object.assign(Object.assign({}, result), { colorType: (_a = extractColorType(params)) !== null && _a !== void 0 ? _a : "int" })
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((args) => createColorObjectBindingReader(args.params.colorType), "reader"),
    equals: equalsColor,
    writer: /* @__PURE__ */ __name((args) => createColorObjectWriter(shouldSupportAlpha(args.initialValue), args.params.colorType), "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    var _a, _b;
    const supportsAlpha = isRgbaColorObject(args.initialValue);
    return new ColorController(args.document, {
      colorType: args.params.colorType,
      expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
      formatter: createColorObjectFormatter(supportsAlpha, args.params.colorType),
      parser: createColorStringParser("int"),
      pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
      supportsAlpha,
      value: args.value,
      viewProps: args.viewProps
    });
  }, "controller")
});
var StringColorInputPlugin = createPlugin({
  id: "input-color-string",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "string") {
      return null;
    }
    if (params.view === "text") {
      return null;
    }
    const format = detectStringColorFormat(value, extractColorType(params));
    if (!format) {
      return null;
    }
    const stringifier = findColorStringifier(format);
    if (!stringifier) {
      return null;
    }
    const result = parseColorInputParams(params);
    return result ? {
      initialValue: value,
      params: Object.assign(Object.assign({}, result), { format, stringifier })
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name(() => readIntColorString, "reader"),
    equals: equalsColor,
    writer: /* @__PURE__ */ __name((args) => {
      const writer = createColorStringWriter(args.params.format);
      if (!writer) {
        throw TpError.notBindable();
      }
      return writer;
    }, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    var _a, _b;
    return new ColorController(args.document, {
      colorType: args.params.format.type,
      expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
      formatter: args.params.stringifier,
      parser: createColorStringParser("int"),
      pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
      supportsAlpha: args.params.format.alpha,
      value: args.value,
      viewProps: args.viewProps
    });
  }, "controller")
});
var PointNdConstraint = class {
  static {
    __name(this, "PointNdConstraint");
  }
  constructor(config) {
    this.components = config.components;
    this.asm_ = config.assembly;
  }
  constrain(value) {
    const comps = this.asm_.toComponents(value).map((comp, index) => {
      var _a, _b;
      return (_b = (_a = this.components[index]) === null || _a === void 0 ? void 0 : _a.constrain(comp)) !== null && _b !== void 0 ? _b : comp;
    });
    return this.asm_.fromComponents(comps);
  }
};
var cn$6 = ClassName("pndtxt");
var PointNdTextView = class {
  static {
    __name(this, "PointNdTextView");
  }
  constructor(doc, config) {
    this.textViews = config.textViews;
    this.element = doc.createElement("div");
    this.element.classList.add(cn$6());
    this.textViews.forEach((v) => {
      const axisElem = doc.createElement("div");
      axisElem.classList.add(cn$6("a"));
      axisElem.appendChild(v.element);
      this.element.appendChild(axisElem);
    });
  }
};
function createAxisController(doc, config, index) {
  return new NumberTextController(doc, {
    arrayPosition: index === 0 ? "fst" : index === config.axes.length - 1 ? "lst" : "mid",
    parser: config.parser,
    props: config.axes[index].textProps,
    value: createValue(0, {
      constraint: config.axes[index].constraint
    }),
    viewProps: config.viewProps
  });
}
__name(createAxisController, "createAxisController");
var PointNdTextController = class {
  static {
    __name(this, "PointNdTextController");
  }
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.acs_ = config.axes.map((_, index) => createAxisController(doc, config, index));
    this.acs_.forEach((c, index) => {
      connectValues({
        primary: this.value,
        secondary: c.value,
        forward: /* @__PURE__ */ __name((p) => config.assembly.toComponents(p)[index], "forward"),
        backward: /* @__PURE__ */ __name((p, s) => {
          const comps = config.assembly.toComponents(p);
          comps[index] = s;
          return config.assembly.fromComponents(comps);
        }, "backward")
      });
    });
    this.view = new PointNdTextView(doc, {
      textViews: this.acs_.map((ac) => ac.view)
    });
  }
  get textControllers() {
    return this.acs_;
  }
};
var SliderInputBindingApi = class extends BindingApi {
  static {
    __name(this, "SliderInputBindingApi");
  }
  get max() {
    return this.controller.valueController.sliderController.props.get("max");
  }
  set max(max) {
    this.controller.valueController.sliderController.props.set("max", max);
  }
  get min() {
    return this.controller.valueController.sliderController.props.get("min");
  }
  set min(max) {
    this.controller.valueController.sliderController.props.set("min", max);
  }
};
function createConstraint$4(params, initialValue) {
  const constraints = [];
  const sc = createStepConstraint(params, initialValue);
  if (sc) {
    constraints.push(sc);
  }
  const rc = createRangeConstraint(params);
  if (rc) {
    constraints.push(rc);
  }
  const lc = createListConstraint(params.options);
  if (lc) {
    constraints.push(lc);
  }
  return new CompositeConstraint(constraints);
}
__name(createConstraint$4, "createConstraint$4");
var NumberInputPlugin = createPlugin({
  id: "input-number",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "number") {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createNumberTextInputParamsParser(p)), { options: p.optional.custom(parseListOptions), readonly: p.optional.constant(false) }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => numberFromUnknown, "reader"),
    constraint: /* @__PURE__ */ __name((args) => createConstraint$4(args.params, args.initialValue), "constraint"),
    writer: /* @__PURE__ */ __name((_args) => writePrimitive, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    const value = args.value;
    const c = args.constraint;
    const lc = c && findConstraint(c, ListConstraint);
    if (lc) {
      return new ListController(args.document, {
        props: new ValueMap({
          options: lc.values.value("options")
        }),
        value,
        viewProps: args.viewProps
      });
    }
    const textPropsObj = createNumberTextPropsObject(args.params, value.rawValue);
    const drc = c && findConstraint(c, DefiniteRangeConstraint);
    if (drc) {
      return new SliderTextController(args.document, Object.assign(Object.assign({}, createSliderTextProps(Object.assign(Object.assign({}, textPropsObj), { keyScale: createValue(textPropsObj.keyScale), max: drc.values.value("max"), min: drc.values.value("min") }))), { parser: parseNumber, value, viewProps: args.viewProps }));
    }
    return new NumberTextController(args.document, {
      parser: parseNumber,
      props: ValueMap.fromObject(textPropsObj),
      value,
      viewProps: args.viewProps
    });
  }, "controller"),
  api(args) {
    if (typeof args.controller.value.rawValue !== "number") {
      return null;
    }
    if (args.controller.valueController instanceof SliderTextController) {
      return new SliderInputBindingApi(args.controller);
    }
    if (args.controller.valueController instanceof ListController) {
      return new ListInputBindingApi(args.controller);
    }
    return null;
  }
});
var Point2d = class {
  static {
    __name(this, "Point2d");
  }
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  getComponents() {
    return [this.x, this.y];
  }
  static isObject(obj) {
    if (isEmpty(obj)) {
      return false;
    }
    const x = obj.x;
    const y = obj.y;
    if (typeof x !== "number" || typeof y !== "number") {
      return false;
    }
    return true;
  }
  static equals(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y;
  }
  toObject() {
    return {
      x: this.x,
      y: this.y
    };
  }
};
var Point2dAssembly = {
  toComponents: /* @__PURE__ */ __name((p) => p.getComponents(), "toComponents"),
  fromComponents: /* @__PURE__ */ __name((comps) => new Point2d(...comps), "fromComponents")
};
var cn$5 = ClassName("p2d");
var Point2dView = class {
  static {
    __name(this, "Point2dView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn$5());
    config.viewProps.bindClassModifiers(this.element);
    bindValue(config.expanded, valueToClassName(this.element, cn$5(void 0, "expanded")));
    const headElem = doc.createElement("div");
    headElem.classList.add(cn$5("h"));
    this.element.appendChild(headElem);
    const buttonElem = doc.createElement("button");
    buttonElem.classList.add(cn$5("b"));
    buttonElem.appendChild(createSvgIconElement(doc, "p2dpad"));
    config.viewProps.bindDisabled(buttonElem);
    headElem.appendChild(buttonElem);
    this.buttonElement = buttonElem;
    const textElem = doc.createElement("div");
    textElem.classList.add(cn$5("t"));
    headElem.appendChild(textElem);
    this.textElement = textElem;
    if (config.pickerLayout === "inline") {
      const pickerElem = doc.createElement("div");
      pickerElem.classList.add(cn$5("p"));
      this.element.appendChild(pickerElem);
      this.pickerElement = pickerElem;
    } else {
      this.pickerElement = null;
    }
  }
};
var cn$4 = ClassName("p2dp");
var Point2dPickerView = class {
  static {
    __name(this, "Point2dPickerView");
  }
  constructor(doc, config) {
    this.onFoldableChange_ = this.onFoldableChange_.bind(this);
    this.onPropsChange_ = this.onPropsChange_.bind(this);
    this.onValueChange_ = this.onValueChange_.bind(this);
    this.props_ = config.props;
    this.props_.emitter.on("change", this.onPropsChange_);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$4());
    if (config.layout === "popup") {
      this.element.classList.add(cn$4(void 0, "p"));
    }
    config.viewProps.bindClassModifiers(this.element);
    const padElem = doc.createElement("div");
    padElem.classList.add(cn$4("p"));
    config.viewProps.bindTabIndex(padElem);
    this.element.appendChild(padElem);
    this.padElement = padElem;
    const svgElem = doc.createElementNS(SVG_NS, "svg");
    svgElem.classList.add(cn$4("g"));
    this.padElement.appendChild(svgElem);
    this.svgElem_ = svgElem;
    const xAxisElem = doc.createElementNS(SVG_NS, "line");
    xAxisElem.classList.add(cn$4("ax"));
    xAxisElem.setAttributeNS(null, "x1", "0");
    xAxisElem.setAttributeNS(null, "y1", "50%");
    xAxisElem.setAttributeNS(null, "x2", "100%");
    xAxisElem.setAttributeNS(null, "y2", "50%");
    this.svgElem_.appendChild(xAxisElem);
    const yAxisElem = doc.createElementNS(SVG_NS, "line");
    yAxisElem.classList.add(cn$4("ax"));
    yAxisElem.setAttributeNS(null, "x1", "50%");
    yAxisElem.setAttributeNS(null, "y1", "0");
    yAxisElem.setAttributeNS(null, "x2", "50%");
    yAxisElem.setAttributeNS(null, "y2", "100%");
    this.svgElem_.appendChild(yAxisElem);
    const lineElem = doc.createElementNS(SVG_NS, "line");
    lineElem.classList.add(cn$4("l"));
    lineElem.setAttributeNS(null, "x1", "50%");
    lineElem.setAttributeNS(null, "y1", "50%");
    this.svgElem_.appendChild(lineElem);
    this.lineElem_ = lineElem;
    const markerElem = doc.createElement("div");
    markerElem.classList.add(cn$4("m"));
    this.padElement.appendChild(markerElem);
    this.markerElem_ = markerElem;
    config.value.emitter.on("change", this.onValueChange_);
    this.value = config.value;
    this.update_();
  }
  get allFocusableElements() {
    return [this.padElement];
  }
  update_() {
    const [x, y] = this.value.rawValue.getComponents();
    const max = this.props_.get("max");
    const px = mapRange(x, -max, +max, 0, 100);
    const py = mapRange(y, -max, +max, 0, 100);
    const ipy = this.props_.get("invertsY") ? 100 - py : py;
    this.lineElem_.setAttributeNS(null, "x2", `${px}%`);
    this.lineElem_.setAttributeNS(null, "y2", `${ipy}%`);
    this.markerElem_.style.left = `${px}%`;
    this.markerElem_.style.top = `${ipy}%`;
  }
  onValueChange_() {
    this.update_();
  }
  onPropsChange_() {
    this.update_();
  }
  onFoldableChange_() {
    this.update_();
  }
};
function computeOffset(ev, keyScales, invertsY) {
  return [
    getStepForKey(keyScales[0], getHorizontalStepKeys(ev)),
    getStepForKey(keyScales[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1)
  ];
}
__name(computeOffset, "computeOffset");
var Point2dPickerController = class {
  static {
    __name(this, "Point2dPickerController");
  }
  constructor(doc, config) {
    this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
    this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
    this.onPointerDown_ = this.onPointerDown_.bind(this);
    this.onPointerMove_ = this.onPointerMove_.bind(this);
    this.onPointerUp_ = this.onPointerUp_.bind(this);
    this.props = config.props;
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new Point2dPickerView(doc, {
      layout: config.layout,
      props: this.props,
      value: this.value,
      viewProps: this.viewProps
    });
    this.ptHandler_ = new PointerHandler(this.view.padElement);
    this.ptHandler_.emitter.on("down", this.onPointerDown_);
    this.ptHandler_.emitter.on("move", this.onPointerMove_);
    this.ptHandler_.emitter.on("up", this.onPointerUp_);
    this.view.padElement.addEventListener("keydown", this.onPadKeyDown_);
    this.view.padElement.addEventListener("keyup", this.onPadKeyUp_);
  }
  handlePointerEvent_(d, opts) {
    if (!d.point) {
      return;
    }
    const max = this.props.get("max");
    const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
    const py = mapRange(this.props.get("invertsY") ? d.bounds.height - d.point.y : d.point.y, 0, d.bounds.height, -max, +max);
    this.value.setRawValue(new Point2d(px, py), opts);
  }
  onPointerDown_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerMove_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: false,
      last: false
    });
  }
  onPointerUp_(ev) {
    this.handlePointerEvent_(ev.data, {
      forceEmit: true,
      last: true
    });
  }
  onPadKeyDown_(ev) {
    if (isArrowKey(ev.key)) {
      ev.preventDefault();
    }
    const [dx, dy] = computeOffset(ev, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
    if (dx === 0 && dy === 0) {
      return;
    }
    this.value.setRawValue(new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy), {
      forceEmit: false,
      last: false
    });
  }
  onPadKeyUp_(ev) {
    const [dx, dy] = computeOffset(ev, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
    if (dx === 0 && dy === 0) {
      return;
    }
    this.value.setRawValue(this.value.rawValue, {
      forceEmit: true,
      last: true
    });
  }
};
var Point2dController = class {
  static {
    __name(this, "Point2dController");
  }
  constructor(doc, config) {
    var _a, _b;
    this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
    this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
    this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
    this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.foldable_ = Foldable.create(config.expanded);
    this.popC_ = config.pickerLayout === "popup" ? new PopupController(doc, {
      viewProps: this.viewProps
    }) : null;
    const padC = new Point2dPickerController(doc, {
      layout: config.pickerLayout,
      props: new ValueMap({
        invertsY: createValue(config.invertsY),
        max: createValue(config.max),
        xKeyScale: config.axes[0].textProps.value("keyScale"),
        yKeyScale: config.axes[1].textProps.value("keyScale")
      }),
      value: this.value,
      viewProps: this.viewProps
    });
    padC.view.allFocusableElements.forEach((elem) => {
      elem.addEventListener("blur", this.onPopupChildBlur_);
      elem.addEventListener("keydown", this.onPopupChildKeydown_);
    });
    this.pickerC_ = padC;
    this.textC_ = new PointNdTextController(doc, {
      assembly: Point2dAssembly,
      axes: config.axes,
      parser: config.parser,
      value: this.value,
      viewProps: this.viewProps
    });
    this.view = new Point2dView(doc, {
      expanded: this.foldable_.value("expanded"),
      pickerLayout: config.pickerLayout,
      viewProps: this.viewProps
    });
    this.view.textElement.appendChild(this.textC_.view.element);
    (_a = this.view.buttonElement) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", this.onPadButtonBlur_);
    (_b = this.view.buttonElement) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.onPadButtonClick_);
    if (this.popC_) {
      this.view.element.appendChild(this.popC_.view.element);
      this.popC_.view.element.appendChild(this.pickerC_.view.element);
      connectValues({
        primary: this.foldable_.value("expanded"),
        secondary: this.popC_.shows,
        forward: /* @__PURE__ */ __name((p) => p, "forward"),
        backward: /* @__PURE__ */ __name((_, s) => s, "backward")
      });
    } else if (this.view.pickerElement) {
      this.view.pickerElement.appendChild(this.pickerC_.view.element);
      bindFoldable(this.foldable_, this.view.pickerElement);
    }
  }
  get textController() {
    return this.textC_;
  }
  onPadButtonBlur_(e) {
    if (!this.popC_) {
      return;
    }
    const elem = this.view.element;
    const nextTarget = forceCast(e.relatedTarget);
    if (!nextTarget || !elem.contains(nextTarget)) {
      this.popC_.shows.rawValue = false;
    }
  }
  onPadButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded"));
    if (this.foldable_.get("expanded")) {
      this.pickerC_.view.allFocusableElements[0].focus();
    }
  }
  onPopupChildBlur_(ev) {
    if (!this.popC_) {
      return;
    }
    const elem = this.popC_.view.element;
    const nextTarget = findNextTarget(ev);
    if (nextTarget && elem.contains(nextTarget)) {
      return;
    }
    if (nextTarget && nextTarget === this.view.buttonElement && !supportsTouch(elem.ownerDocument)) {
      return;
    }
    this.popC_.shows.rawValue = false;
  }
  onPopupChildKeydown_(ev) {
    if (this.popC_) {
      if (ev.key === "Escape") {
        this.popC_.shows.rawValue = false;
      }
    } else if (this.view.pickerElement) {
      if (ev.key === "Escape") {
        this.view.buttonElement.focus();
      }
    }
  }
};
function point2dFromUnknown(value) {
  return Point2d.isObject(value) ? new Point2d(value.x, value.y) : new Point2d();
}
__name(point2dFromUnknown, "point2dFromUnknown");
function writePoint2d(target, value) {
  target.writeProperty("x", value.x);
  target.writeProperty("y", value.y);
}
__name(writePoint2d, "writePoint2d");
function createConstraint$3(params, initialValue) {
  return new PointNdConstraint({
    assembly: Point2dAssembly,
    components: [
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y)
    ]
  });
}
__name(createConstraint$3, "createConstraint$3");
function getSuitableMaxDimensionValue(params, rawValue) {
  var _a, _b;
  if (!isEmpty(params.min) || !isEmpty(params.max)) {
    return Math.max(Math.abs((_a = params.min) !== null && _a !== void 0 ? _a : 0), Math.abs((_b = params.max) !== null && _b !== void 0 ? _b : 0));
  }
  const step = getSuitableKeyScale(params);
  return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
}
__name(getSuitableMaxDimensionValue, "getSuitableMaxDimensionValue");
function getSuitableMax(params, initialValue) {
  var _a, _b;
  const xr = getSuitableMaxDimensionValue(deepMerge(params, (_a = params.x) !== null && _a !== void 0 ? _a : {}), initialValue.x);
  const yr = getSuitableMaxDimensionValue(deepMerge(params, (_b = params.y) !== null && _b !== void 0 ? _b : {}), initialValue.y);
  return Math.max(xr, yr);
}
__name(getSuitableMax, "getSuitableMax");
function shouldInvertY(params) {
  if (!("y" in params)) {
    return false;
  }
  const yParams = params.y;
  if (!yParams) {
    return false;
  }
  return "inverted" in yParams ? !!yParams.inverted : false;
}
__name(shouldInvertY, "shouldInvertY");
var Point2dInputPlugin = createPlugin({
  id: "input-point2d",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (!Point2d.isObject(value)) {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createPointDimensionParser(p)), { expanded: p.optional.boolean, picker: p.optional.custom(parsePickerLayout), readonly: p.optional.constant(false), x: p.optional.custom(parsePointDimensionParams), y: p.optional.object(Object.assign(Object.assign({}, createPointDimensionParser(p)), { inverted: p.optional.boolean })) }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name(() => point2dFromUnknown, "reader"),
    constraint: /* @__PURE__ */ __name((args) => createConstraint$3(args.params, args.initialValue), "constraint"),
    equals: Point2d.equals,
    writer: /* @__PURE__ */ __name(() => writePoint2d, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    var _a, _b;
    const doc = args.document;
    const value = args.value;
    const c = args.constraint;
    const dParams = [args.params.x, args.params.y];
    return new Point2dController(doc, {
      axes: value.rawValue.getComponents().map((comp, i) => {
        var _a2;
        return createPointAxis({
          constraint: c.components[i],
          initialValue: comp,
          params: deepMerge(args.params, (_a2 = dParams[i]) !== null && _a2 !== void 0 ? _a2 : {})
        });
      }),
      expanded: (_a = args.params.expanded) !== null && _a !== void 0 ? _a : false,
      invertsY: shouldInvertY(args.params),
      max: getSuitableMax(args.params, value.rawValue),
      parser: parseNumber,
      pickerLayout: (_b = args.params.picker) !== null && _b !== void 0 ? _b : "popup",
      value,
      viewProps: args.viewProps
    });
  }, "controller")
});
var Point3d = class {
  static {
    __name(this, "Point3d");
  }
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  getComponents() {
    return [this.x, this.y, this.z];
  }
  static isObject(obj) {
    if (isEmpty(obj)) {
      return false;
    }
    const x = obj.x;
    const y = obj.y;
    const z = obj.z;
    if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number") {
      return false;
    }
    return true;
  }
  static equals(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }
  toObject() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }
};
var Point3dAssembly = {
  toComponents: /* @__PURE__ */ __name((p) => p.getComponents(), "toComponents"),
  fromComponents: /* @__PURE__ */ __name((comps) => new Point3d(...comps), "fromComponents")
};
function point3dFromUnknown(value) {
  return Point3d.isObject(value) ? new Point3d(value.x, value.y, value.z) : new Point3d();
}
__name(point3dFromUnknown, "point3dFromUnknown");
function writePoint3d(target, value) {
  target.writeProperty("x", value.x);
  target.writeProperty("y", value.y);
  target.writeProperty("z", value.z);
}
__name(writePoint3d, "writePoint3d");
function createConstraint$2(params, initialValue) {
  return new PointNdConstraint({
    assembly: Point3dAssembly,
    components: [
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z)
    ]
  });
}
__name(createConstraint$2, "createConstraint$2");
var Point3dInputPlugin = createPlugin({
  id: "input-point3d",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (!Point3d.isObject(value)) {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createPointDimensionParser(p)), { readonly: p.optional.constant(false), x: p.optional.custom(parsePointDimensionParams), y: p.optional.custom(parsePointDimensionParams), z: p.optional.custom(parsePointDimensionParams) }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => point3dFromUnknown, "reader"),
    constraint: /* @__PURE__ */ __name((args) => createConstraint$2(args.params, args.initialValue), "constraint"),
    equals: Point3d.equals,
    writer: /* @__PURE__ */ __name((_args) => writePoint3d, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    const value = args.value;
    const c = args.constraint;
    const dParams = [args.params.x, args.params.y, args.params.z];
    return new PointNdTextController(args.document, {
      assembly: Point3dAssembly,
      axes: value.rawValue.getComponents().map((comp, i) => {
        var _a;
        return createPointAxis({
          constraint: c.components[i],
          initialValue: comp,
          params: deepMerge(args.params, (_a = dParams[i]) !== null && _a !== void 0 ? _a : {})
        });
      }),
      parser: parseNumber,
      value,
      viewProps: args.viewProps
    });
  }, "controller")
});
var Point4d = class {
  static {
    __name(this, "Point4d");
  }
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  getComponents() {
    return [this.x, this.y, this.z, this.w];
  }
  static isObject(obj) {
    if (isEmpty(obj)) {
      return false;
    }
    const x = obj.x;
    const y = obj.y;
    const z = obj.z;
    const w = obj.w;
    if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number" || typeof w !== "number") {
      return false;
    }
    return true;
  }
  static equals(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
  }
  toObject() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w
    };
  }
};
var Point4dAssembly = {
  toComponents: /* @__PURE__ */ __name((p) => p.getComponents(), "toComponents"),
  fromComponents: /* @__PURE__ */ __name((comps) => new Point4d(...comps), "fromComponents")
};
function point4dFromUnknown(value) {
  return Point4d.isObject(value) ? new Point4d(value.x, value.y, value.z, value.w) : new Point4d();
}
__name(point4dFromUnknown, "point4dFromUnknown");
function writePoint4d(target, value) {
  target.writeProperty("x", value.x);
  target.writeProperty("y", value.y);
  target.writeProperty("z", value.z);
  target.writeProperty("w", value.w);
}
__name(writePoint4d, "writePoint4d");
function createConstraint$1(params, initialValue) {
  return new PointNdConstraint({
    assembly: Point4dAssembly,
    components: [
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.x), initialValue.x),
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.y), initialValue.y),
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.z), initialValue.z),
      createDimensionConstraint(Object.assign(Object.assign({}, params), params.w), initialValue.w)
    ]
  });
}
__name(createConstraint$1, "createConstraint$1");
var Point4dInputPlugin = createPlugin({
  id: "input-point4d",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (!Point4d.isObject(value)) {
      return null;
    }
    const result = parseRecord(params, (p) => Object.assign(Object.assign({}, createPointDimensionParser(p)), { readonly: p.optional.constant(false), w: p.optional.custom(parsePointDimensionParams), x: p.optional.custom(parsePointDimensionParams), y: p.optional.custom(parsePointDimensionParams), z: p.optional.custom(parsePointDimensionParams) }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => point4dFromUnknown, "reader"),
    constraint: /* @__PURE__ */ __name((args) => createConstraint$1(args.params, args.initialValue), "constraint"),
    equals: Point4d.equals,
    writer: /* @__PURE__ */ __name((_args) => writePoint4d, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    const value = args.value;
    const c = args.constraint;
    const dParams = [
      args.params.x,
      args.params.y,
      args.params.z,
      args.params.w
    ];
    return new PointNdTextController(args.document, {
      assembly: Point4dAssembly,
      axes: value.rawValue.getComponents().map((comp, i) => {
        var _a;
        return createPointAxis({
          constraint: c.components[i],
          initialValue: comp,
          params: deepMerge(args.params, (_a = dParams[i]) !== null && _a !== void 0 ? _a : {})
        });
      }),
      parser: parseNumber,
      value,
      viewProps: args.viewProps
    });
  }, "controller")
});
function createConstraint(params) {
  const constraints = [];
  const lc = createListConstraint(params.options);
  if (lc) {
    constraints.push(lc);
  }
  return new CompositeConstraint(constraints);
}
__name(createConstraint, "createConstraint");
var StringInputPlugin = createPlugin({
  id: "input-string",
  type: "input",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "string") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      readonly: p.optional.constant(false),
      options: p.optional.custom(parseListOptions)
    }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => stringFromUnknown, "reader"),
    constraint: /* @__PURE__ */ __name((args) => createConstraint(args.params), "constraint"),
    writer: /* @__PURE__ */ __name((_args) => writePrimitive, "writer")
  },
  controller: /* @__PURE__ */ __name((args) => {
    const doc = args.document;
    const value = args.value;
    const c = args.constraint;
    const lc = c && findConstraint(c, ListConstraint);
    if (lc) {
      return new ListController(doc, {
        props: new ValueMap({
          options: lc.values.value("options")
        }),
        value,
        viewProps: args.viewProps
      });
    }
    return new TextController(doc, {
      parser: /* @__PURE__ */ __name((v) => v, "parser"),
      props: ValueMap.fromObject({
        formatter: formatString
      }),
      value,
      viewProps: args.viewProps
    });
  }, "controller"),
  api(args) {
    if (typeof args.controller.value.rawValue !== "string") {
      return null;
    }
    if (args.controller.valueController instanceof ListController) {
      return new ListInputBindingApi(args.controller);
    }
    return null;
  }
});
var Constants = {
  monitor: {
    defaultInterval: 200,
    defaultRows: 3
  }
};
var cn$3 = ClassName("mll");
var MultiLogView = class {
  static {
    __name(this, "MultiLogView");
  }
  constructor(doc, config) {
    this.onValueUpdate_ = this.onValueUpdate_.bind(this);
    this.formatter_ = config.formatter;
    this.element = doc.createElement("div");
    this.element.classList.add(cn$3());
    config.viewProps.bindClassModifiers(this.element);
    const textareaElem = doc.createElement("textarea");
    textareaElem.classList.add(cn$3("i"));
    textareaElem.style.height = `calc(var(${getCssVar("containerUnitSize")}) * ${config.rows})`;
    textareaElem.readOnly = true;
    config.viewProps.bindDisabled(textareaElem);
    this.element.appendChild(textareaElem);
    this.textareaElem_ = textareaElem;
    config.value.emitter.on("change", this.onValueUpdate_);
    this.value = config.value;
    this.update_();
  }
  update_() {
    const elem = this.textareaElem_;
    const shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
    const lines = [];
    this.value.rawValue.forEach((value) => {
      if (value !== void 0) {
        lines.push(this.formatter_(value));
      }
    });
    elem.textContent = lines.join("\n");
    if (shouldScroll) {
      elem.scrollTop = elem.scrollHeight;
    }
  }
  onValueUpdate_() {
    this.update_();
  }
};
var MultiLogController = class {
  static {
    __name(this, "MultiLogController");
  }
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new MultiLogView(doc, {
      formatter: config.formatter,
      rows: config.rows,
      value: this.value,
      viewProps: this.viewProps
    });
  }
};
var cn$2 = ClassName("sgl");
var SingleLogView = class {
  static {
    __name(this, "SingleLogView");
  }
  constructor(doc, config) {
    this.onValueUpdate_ = this.onValueUpdate_.bind(this);
    this.formatter_ = config.formatter;
    this.element = doc.createElement("div");
    this.element.classList.add(cn$2());
    config.viewProps.bindClassModifiers(this.element);
    const inputElem = doc.createElement("input");
    inputElem.classList.add(cn$2("i"));
    inputElem.readOnly = true;
    inputElem.type = "text";
    config.viewProps.bindDisabled(inputElem);
    this.element.appendChild(inputElem);
    this.inputElement = inputElem;
    config.value.emitter.on("change", this.onValueUpdate_);
    this.value = config.value;
    this.update_();
  }
  update_() {
    const values = this.value.rawValue;
    const lastValue = values[values.length - 1];
    this.inputElement.value = lastValue !== void 0 ? this.formatter_(lastValue) : "";
  }
  onValueUpdate_() {
    this.update_();
  }
};
var SingleLogController = class {
  static {
    __name(this, "SingleLogController");
  }
  constructor(doc, config) {
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.view = new SingleLogView(doc, {
      formatter: config.formatter,
      value: this.value,
      viewProps: this.viewProps
    });
  }
};
var BooleanMonitorPlugin = createPlugin({
  id: "monitor-bool",
  type: "monitor",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "boolean") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      readonly: p.required.constant(true),
      rows: p.optional.number
    }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => boolFromUnknown, "reader")
  },
  controller: /* @__PURE__ */ __name((args) => {
    var _a;
    if (args.value.rawValue.length === 1) {
      return new SingleLogController(args.document, {
        formatter: BooleanFormatter,
        value: args.value,
        viewProps: args.viewProps
      });
    }
    return new MultiLogController(args.document, {
      formatter: BooleanFormatter,
      rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
      value: args.value,
      viewProps: args.viewProps
    });
  }, "controller")
});
var GraphLogMonitorBindingApi = class extends BindingApi {
  static {
    __name(this, "GraphLogMonitorBindingApi");
  }
  get max() {
    return this.controller.valueController.props.get("max");
  }
  set max(max) {
    this.controller.valueController.props.set("max", max);
  }
  get min() {
    return this.controller.valueController.props.get("min");
  }
  set min(min) {
    this.controller.valueController.props.set("min", min);
  }
};
var cn$1 = ClassName("grl");
var GraphLogView = class {
  static {
    __name(this, "GraphLogView");
  }
  constructor(doc, config) {
    this.onCursorChange_ = this.onCursorChange_.bind(this);
    this.onValueUpdate_ = this.onValueUpdate_.bind(this);
    this.element = doc.createElement("div");
    this.element.classList.add(cn$1());
    config.viewProps.bindClassModifiers(this.element);
    this.formatter_ = config.formatter;
    this.props_ = config.props;
    this.cursor_ = config.cursor;
    this.cursor_.emitter.on("change", this.onCursorChange_);
    const svgElem = doc.createElementNS(SVG_NS, "svg");
    svgElem.classList.add(cn$1("g"));
    svgElem.style.height = `calc(var(${getCssVar("containerUnitSize")}) * ${config.rows})`;
    this.element.appendChild(svgElem);
    this.svgElem_ = svgElem;
    const lineElem = doc.createElementNS(SVG_NS, "polyline");
    this.svgElem_.appendChild(lineElem);
    this.lineElem_ = lineElem;
    const tooltipElem = doc.createElement("div");
    tooltipElem.classList.add(cn$1("t"), ClassName("tt")());
    this.element.appendChild(tooltipElem);
    this.tooltipElem_ = tooltipElem;
    config.value.emitter.on("change", this.onValueUpdate_);
    this.value = config.value;
    this.update_();
  }
  get graphElement() {
    return this.svgElem_;
  }
  update_() {
    const { clientWidth: w, clientHeight: h } = this.element;
    const maxIndex = this.value.rawValue.length - 1;
    const min = this.props_.get("min");
    const max = this.props_.get("max");
    const points = [];
    this.value.rawValue.forEach((v, index) => {
      if (v === void 0) {
        return;
      }
      const x = mapRange(index, 0, maxIndex, 0, w);
      const y = mapRange(v, min, max, h, 0);
      points.push([x, y].join(","));
    });
    this.lineElem_.setAttributeNS(null, "points", points.join(" "));
    const tooltipElem = this.tooltipElem_;
    const value = this.value.rawValue[this.cursor_.rawValue];
    if (value === void 0) {
      tooltipElem.classList.remove(cn$1("t", "a"));
      return;
    }
    const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, w);
    const ty = mapRange(value, min, max, h, 0);
    tooltipElem.style.left = `${tx}px`;
    tooltipElem.style.top = `${ty}px`;
    tooltipElem.textContent = `${this.formatter_(value)}`;
    if (!tooltipElem.classList.contains(cn$1("t", "a"))) {
      tooltipElem.classList.add(cn$1("t", "a"), cn$1("t", "in"));
      forceReflow(tooltipElem);
      tooltipElem.classList.remove(cn$1("t", "in"));
    }
  }
  onValueUpdate_() {
    this.update_();
  }
  onCursorChange_() {
    this.update_();
  }
};
var GraphLogController = class {
  static {
    __name(this, "GraphLogController");
  }
  constructor(doc, config) {
    this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
    this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
    this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
    this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
    this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
    this.props = config.props;
    this.value = config.value;
    this.viewProps = config.viewProps;
    this.cursor_ = createValue(-1);
    this.view = new GraphLogView(doc, {
      cursor: this.cursor_,
      formatter: config.formatter,
      rows: config.rows,
      props: this.props,
      value: this.value,
      viewProps: this.viewProps
    });
    if (!supportsTouch(doc)) {
      this.view.element.addEventListener("mousemove", this.onGraphMouseMove_);
      this.view.element.addEventListener("mouseleave", this.onGraphMouseLeave_);
    } else {
      const ph = new PointerHandler(this.view.element);
      ph.emitter.on("down", this.onGraphPointerDown_);
      ph.emitter.on("move", this.onGraphPointerMove_);
      ph.emitter.on("up", this.onGraphPointerUp_);
    }
  }
  importProps(state) {
    return importBladeState(state, null, (p) => ({
      max: p.required.number,
      min: p.required.number
    }), (result) => {
      this.props.set("max", result.max);
      this.props.set("min", result.min);
      return true;
    });
  }
  exportProps() {
    return exportBladeState(null, {
      max: this.props.get("max"),
      min: this.props.get("min")
    });
  }
  onGraphMouseLeave_() {
    this.cursor_.rawValue = -1;
  }
  onGraphMouseMove_(ev) {
    const { clientWidth: w } = this.view.element;
    this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, w, 0, this.value.rawValue.length));
  }
  onGraphPointerDown_(ev) {
    this.onGraphPointerMove_(ev);
  }
  onGraphPointerMove_(ev) {
    if (!ev.data.point) {
      this.cursor_.rawValue = -1;
      return;
    }
    this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
  }
  onGraphPointerUp_() {
    this.cursor_.rawValue = -1;
  }
};
function createFormatter(params) {
  return !isEmpty(params.format) ? params.format : createNumberFormatter(2);
}
__name(createFormatter, "createFormatter");
function createTextMonitor(args) {
  var _a;
  if (args.value.rawValue.length === 1) {
    return new SingleLogController(args.document, {
      formatter: createFormatter(args.params),
      value: args.value,
      viewProps: args.viewProps
    });
  }
  return new MultiLogController(args.document, {
    formatter: createFormatter(args.params),
    rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
    value: args.value,
    viewProps: args.viewProps
  });
}
__name(createTextMonitor, "createTextMonitor");
function createGraphMonitor(args) {
  var _a, _b, _c;
  return new GraphLogController(args.document, {
    formatter: createFormatter(args.params),
    rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
    props: ValueMap.fromObject({
      max: (_b = args.params.max) !== null && _b !== void 0 ? _b : 100,
      min: (_c = args.params.min) !== null && _c !== void 0 ? _c : 0
    }),
    value: args.value,
    viewProps: args.viewProps
  });
}
__name(createGraphMonitor, "createGraphMonitor");
function shouldShowGraph(params) {
  return params.view === "graph";
}
__name(shouldShowGraph, "shouldShowGraph");
var NumberMonitorPlugin = createPlugin({
  id: "monitor-number",
  type: "monitor",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "number") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      format: p.optional.function,
      max: p.optional.number,
      min: p.optional.number,
      readonly: p.required.constant(true),
      rows: p.optional.number,
      view: p.optional.string
    }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    defaultBufferSize: /* @__PURE__ */ __name((params) => shouldShowGraph(params) ? 64 : 1, "defaultBufferSize"),
    reader: /* @__PURE__ */ __name((_args) => numberFromUnknown, "reader")
  },
  controller: /* @__PURE__ */ __name((args) => {
    if (shouldShowGraph(args.params)) {
      return createGraphMonitor(args);
    }
    return createTextMonitor(args);
  }, "controller"),
  api: /* @__PURE__ */ __name((args) => {
    if (args.controller.valueController instanceof GraphLogController) {
      return new GraphLogMonitorBindingApi(args.controller);
    }
    return null;
  }, "api")
});
var StringMonitorPlugin = createPlugin({
  id: "monitor-string",
  type: "monitor",
  accept: /* @__PURE__ */ __name((value, params) => {
    if (typeof value !== "string") {
      return null;
    }
    const result = parseRecord(params, (p) => ({
      multiline: p.optional.boolean,
      readonly: p.required.constant(true),
      rows: p.optional.number
    }));
    return result ? {
      initialValue: value,
      params: result
    } : null;
  }, "accept"),
  binding: {
    reader: /* @__PURE__ */ __name((_args) => stringFromUnknown, "reader")
  },
  controller: /* @__PURE__ */ __name((args) => {
    var _a;
    const value = args.value;
    const multiline = value.rawValue.length > 1 || args.params.multiline;
    if (multiline) {
      return new MultiLogController(args.document, {
        formatter: formatString,
        rows: (_a = args.params.rows) !== null && _a !== void 0 ? _a : Constants.monitor.defaultRows,
        value,
        viewProps: args.viewProps
      });
    }
    return new SingleLogController(args.document, {
      formatter: formatString,
      value,
      viewProps: args.viewProps
    });
  }, "controller")
});
var BladeApiCache = class {
  static {
    __name(this, "BladeApiCache");
  }
  constructor() {
    this.map_ = /* @__PURE__ */ new Map();
  }
  get(bc) {
    var _a;
    return (_a = this.map_.get(bc)) !== null && _a !== void 0 ? _a : null;
  }
  has(bc) {
    return this.map_.has(bc);
  }
  add(bc, api) {
    this.map_.set(bc, api);
    bc.viewProps.handleDispose(() => {
      this.map_.delete(bc);
    });
    return api;
  }
};
var ReadWriteBinding = class {
  static {
    __name(this, "ReadWriteBinding");
  }
  constructor(config) {
    this.target = config.target;
    this.reader_ = config.reader;
    this.writer_ = config.writer;
  }
  read() {
    return this.reader_(this.target.read());
  }
  write(value) {
    this.writer_(this.target, value);
  }
  inject(value) {
    this.write(this.reader_(value));
  }
};
function createInputBindingController(plugin, args) {
  var _a;
  const result = plugin.accept(args.target.read(), args.params);
  if (isEmpty(result)) {
    return null;
  }
  const valueArgs = {
    target: args.target,
    initialValue: result.initialValue,
    params: result.params
  };
  const params = parseRecord(args.params, (p) => ({
    disabled: p.optional.boolean,
    hidden: p.optional.boolean,
    label: p.optional.string,
    tag: p.optional.string
  }));
  const reader = plugin.binding.reader(valueArgs);
  const constraint = plugin.binding.constraint ? plugin.binding.constraint(valueArgs) : void 0;
  const binding = new ReadWriteBinding({
    reader,
    target: args.target,
    writer: plugin.binding.writer(valueArgs)
  });
  const value = new InputBindingValue(createValue(reader(result.initialValue), {
    constraint,
    equals: plugin.binding.equals
  }), binding);
  const controller = plugin.controller({
    constraint,
    document: args.document,
    initialValue: result.initialValue,
    params: result.params,
    value,
    viewProps: ViewProps.create({
      disabled: params === null || params === void 0 ? void 0 : params.disabled,
      hidden: params === null || params === void 0 ? void 0 : params.hidden
    })
  });
  return new InputBindingController(args.document, {
    blade: createBlade(),
    props: ValueMap.fromObject({
      label: "label" in args.params ? (_a = params === null || params === void 0 ? void 0 : params.label) !== null && _a !== void 0 ? _a : null : args.target.key
    }),
    tag: params === null || params === void 0 ? void 0 : params.tag,
    value,
    valueController: controller
  });
}
__name(createInputBindingController, "createInputBindingController");
var ReadonlyBinding = class {
  static {
    __name(this, "ReadonlyBinding");
  }
  constructor(config) {
    this.target = config.target;
    this.reader_ = config.reader;
  }
  read() {
    return this.reader_(this.target.read());
  }
};
function createTicker(document2, interval) {
  return interval === 0 ? new ManualTicker() : new IntervalTicker(document2, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
}
__name(createTicker, "createTicker");
function createMonitorBindingController(plugin, args) {
  var _a, _b, _c;
  const result = plugin.accept(args.target.read(), args.params);
  if (isEmpty(result)) {
    return null;
  }
  const bindingArgs = {
    target: args.target,
    initialValue: result.initialValue,
    params: result.params
  };
  const params = parseRecord(args.params, (p) => ({
    bufferSize: p.optional.number,
    disabled: p.optional.boolean,
    hidden: p.optional.boolean,
    interval: p.optional.number,
    label: p.optional.string
  }));
  const reader = plugin.binding.reader(bindingArgs);
  const bufferSize = (_b = (_a = params === null || params === void 0 ? void 0 : params.bufferSize) !== null && _a !== void 0 ? _a : plugin.binding.defaultBufferSize && plugin.binding.defaultBufferSize(result.params)) !== null && _b !== void 0 ? _b : 1;
  const value = new MonitorBindingValue({
    binding: new ReadonlyBinding({
      reader,
      target: args.target
    }),
    bufferSize,
    ticker: createTicker(args.document, params === null || params === void 0 ? void 0 : params.interval)
  });
  const controller = plugin.controller({
    document: args.document,
    params: result.params,
    value,
    viewProps: ViewProps.create({
      disabled: params === null || params === void 0 ? void 0 : params.disabled,
      hidden: params === null || params === void 0 ? void 0 : params.hidden
    })
  });
  controller.viewProps.bindDisabled(value.ticker);
  controller.viewProps.handleDispose(() => {
    value.ticker.dispose();
  });
  return new MonitorBindingController(args.document, {
    blade: createBlade(),
    props: ValueMap.fromObject({
      label: "label" in args.params ? (_c = params === null || params === void 0 ? void 0 : params.label) !== null && _c !== void 0 ? _c : null : args.target.key
    }),
    value,
    valueController: controller
  });
}
__name(createMonitorBindingController, "createMonitorBindingController");
var PluginPool = class {
  static {
    __name(this, "PluginPool");
  }
  constructor(apiCache) {
    this.pluginsMap_ = {
      blades: [],
      inputs: [],
      monitors: []
    };
    this.apiCache_ = apiCache;
  }
  getAll() {
    return [
      ...this.pluginsMap_.blades,
      ...this.pluginsMap_.inputs,
      ...this.pluginsMap_.monitors
    ];
  }
  register(bundleId, r) {
    if (!isCompatible(r.core)) {
      throw TpError.notCompatible(bundleId, r.id);
    }
    if (r.type === "blade") {
      this.pluginsMap_.blades.unshift(r);
    } else if (r.type === "input") {
      this.pluginsMap_.inputs.unshift(r);
    } else if (r.type === "monitor") {
      this.pluginsMap_.monitors.unshift(r);
    }
  }
  createInput_(document2, target, params) {
    return this.pluginsMap_.inputs.reduce((result, plugin) => result !== null && result !== void 0 ? result : createInputBindingController(plugin, {
      document: document2,
      target,
      params
    }), null);
  }
  createMonitor_(document2, target, params) {
    return this.pluginsMap_.monitors.reduce((result, plugin) => result !== null && result !== void 0 ? result : createMonitorBindingController(plugin, {
      document: document2,
      params,
      target
    }), null);
  }
  createBinding(doc, target, params) {
    const initialValue = target.read();
    if (isEmpty(initialValue)) {
      throw new TpError({
        context: {
          key: target.key
        },
        type: "nomatchingcontroller"
      });
    }
    const ic = this.createInput_(doc, target, params);
    if (ic) {
      return ic;
    }
    const mc = this.createMonitor_(doc, target, params);
    if (mc) {
      return mc;
    }
    throw new TpError({
      context: {
        key: target.key
      },
      type: "nomatchingcontroller"
    });
  }
  createBlade(document2, params) {
    const bc = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : createBladeController(plugin, {
      document: document2,
      params
    }), null);
    if (!bc) {
      throw new TpError({
        type: "nomatchingview",
        context: {
          params
        }
      });
    }
    return bc;
  }
  createInputBindingApi_(bc) {
    const api = this.pluginsMap_.inputs.reduce((result, plugin) => {
      var _a, _b;
      if (result) {
        return result;
      }
      return (_b = (_a = plugin.api) === null || _a === void 0 ? void 0 : _a.call(plugin, {
        controller: bc
      })) !== null && _b !== void 0 ? _b : null;
    }, null);
    return this.apiCache_.add(bc, api !== null && api !== void 0 ? api : new BindingApi(bc));
  }
  createMonitorBindingApi_(bc) {
    const api = this.pluginsMap_.monitors.reduce((result, plugin) => {
      var _a, _b;
      if (result) {
        return result;
      }
      return (_b = (_a = plugin.api) === null || _a === void 0 ? void 0 : _a.call(plugin, {
        controller: bc
      })) !== null && _b !== void 0 ? _b : null;
    }, null);
    return this.apiCache_.add(bc, api !== null && api !== void 0 ? api : new BindingApi(bc));
  }
  createBindingApi(bc) {
    if (this.apiCache_.has(bc)) {
      return this.apiCache_.get(bc);
    }
    if (isInputBindingController(bc)) {
      return this.createInputBindingApi_(bc);
    }
    if (isMonitorBindingController(bc)) {
      return this.createMonitorBindingApi_(bc);
    }
    throw TpError.shouldNeverHappen();
  }
  createApi(bc) {
    if (this.apiCache_.has(bc)) {
      return this.apiCache_.get(bc);
    }
    if (isBindingController(bc)) {
      return this.createBindingApi(bc);
    }
    const api = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : plugin.api({
      controller: bc,
      pool: this
    }), null);
    if (!api) {
      throw TpError.shouldNeverHappen();
    }
    return this.apiCache_.add(bc, api);
  }
};
var sharedCache = new BladeApiCache();
function createDefaultPluginPool() {
  const pool = new PluginPool(sharedCache);
  [
    Point2dInputPlugin,
    Point3dInputPlugin,
    Point4dInputPlugin,
    StringInputPlugin,
    NumberInputPlugin,
    StringColorInputPlugin,
    ObjectColorInputPlugin,
    NumberColorInputPlugin,
    BooleanInputPlugin,
    BooleanMonitorPlugin,
    StringMonitorPlugin,
    NumberMonitorPlugin,
    ButtonBladePlugin,
    FolderBladePlugin,
    TabBladePlugin
  ].forEach((p) => {
    pool.register("core", p);
  });
  return pool;
}
__name(createDefaultPluginPool, "createDefaultPluginPool");
var ListBladeApi = class extends BladeApi {
  static {
    __name(this, "ListBladeApi");
  }
  /**
   * @hidden
   */
  constructor(controller) {
    super(controller);
    this.emitter_ = new Emitter();
    this.controller.value.emitter.on("change", (ev) => {
      this.emitter_.emit("change", new TpChangeEvent(this, ev.rawValue));
    });
  }
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(label) {
    this.controller.labelController.props.set("label", label);
  }
  get options() {
    return this.controller.valueController.props.get("options");
  }
  set options(options) {
    this.controller.valueController.props.set("options", options);
  }
  get value() {
    return this.controller.value.rawValue;
  }
  set value(value) {
    this.controller.value.rawValue = value;
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
};
var SeparatorBladeApi = class extends BladeApi {
  static {
    __name(this, "SeparatorBladeApi");
  }
};
var SliderBladeApi = class extends BladeApi {
  static {
    __name(this, "SliderBladeApi");
  }
  /**
   * @hidden
   */
  constructor(controller) {
    super(controller);
    this.emitter_ = new Emitter();
    this.controller.value.emitter.on("change", (ev) => {
      this.emitter_.emit("change", new TpChangeEvent(this, ev.rawValue));
    });
  }
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(label) {
    this.controller.labelController.props.set("label", label);
  }
  get max() {
    return this.controller.valueController.sliderController.props.get("max");
  }
  set max(max) {
    this.controller.valueController.sliderController.props.set("max", max);
  }
  get min() {
    return this.controller.valueController.sliderController.props.get("min");
  }
  set min(min) {
    this.controller.valueController.sliderController.props.set("min", min);
  }
  get value() {
    return this.controller.value.rawValue;
  }
  set value(value) {
    this.controller.value.rawValue = value;
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
};
var TextBladeApi = class extends BladeApi {
  static {
    __name(this, "TextBladeApi");
  }
  /**
   * @hidden
   */
  constructor(controller) {
    super(controller);
    this.emitter_ = new Emitter();
    this.controller.value.emitter.on("change", (ev) => {
      this.emitter_.emit("change", new TpChangeEvent(this, ev.rawValue));
    });
  }
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(label) {
    this.controller.labelController.props.set("label", label);
  }
  get formatter() {
    return this.controller.valueController.props.get("formatter");
  }
  set formatter(formatter) {
    this.controller.valueController.props.set("formatter", formatter);
  }
  get value() {
    return this.controller.value.rawValue;
  }
  set value(value) {
    this.controller.value.rawValue = value;
  }
  on(eventName, handler) {
    const bh = handler.bind(this);
    this.emitter_.on(eventName, (ev) => {
      bh(ev);
    }, {
      key: handler
    });
    return this;
  }
  off(eventName, handler) {
    this.emitter_.off(eventName, handler);
    return this;
  }
};
var ListBladePlugin = /* @__PURE__ */ (function() {
  return {
    id: "list",
    type: "blade",
    core: VERSION$1,
    accept(params) {
      const result = parseRecord(params, (p) => ({
        options: p.required.custom(parseListOptions),
        value: p.required.raw,
        view: p.required.constant("list"),
        label: p.optional.string
      }));
      return result ? { params: result } : null;
    },
    controller(args) {
      const lc = new ListConstraint(normalizeListOptions(args.params.options));
      const value = createValue(args.params.value, {
        constraint: lc
      });
      const ic = new ListController(args.document, {
        props: new ValueMap({
          options: lc.values.value("options")
        }),
        value,
        viewProps: args.viewProps
      });
      return new LabeledValueBladeController(args.document, {
        blade: args.blade,
        props: ValueMap.fromObject({
          label: args.params.label
        }),
        value,
        valueController: ic
      });
    },
    api(args) {
      if (!(args.controller instanceof LabeledValueBladeController)) {
        return null;
      }
      if (!(args.controller.valueController instanceof ListController)) {
        return null;
      }
      return new ListBladeApi(args.controller);
    }
  };
})();
var RootApi = class extends FolderApi {
  static {
    __name(this, "RootApi");
  }
  /**
   * @hidden
   */
  constructor(controller, pool) {
    super(controller, pool);
  }
  get element() {
    return this.controller.view.element;
  }
};
var RootController = class extends FolderController {
  static {
    __name(this, "RootController");
  }
  constructor(doc, config) {
    super(doc, {
      expanded: config.expanded,
      blade: config.blade,
      props: config.props,
      root: true,
      viewProps: config.viewProps
    });
  }
};
var cn = ClassName("spr");
var SeparatorView = class {
  static {
    __name(this, "SeparatorView");
  }
  constructor(doc, config) {
    this.element = doc.createElement("div");
    this.element.classList.add(cn());
    config.viewProps.bindClassModifiers(this.element);
    const hrElem = doc.createElement("hr");
    hrElem.classList.add(cn("r"));
    this.element.appendChild(hrElem);
  }
};
var SeparatorController = class extends BladeController {
  static {
    __name(this, "SeparatorController");
  }
  /**
   * @hidden
   */
  constructor(doc, config) {
    super(Object.assign(Object.assign({}, config), { view: new SeparatorView(doc, {
      viewProps: config.viewProps
    }) }));
  }
};
var SeparatorBladePlugin = {
  id: "separator",
  type: "blade",
  core: VERSION$1,
  accept(params) {
    const result = parseRecord(params, (p) => ({
      view: p.required.constant("separator")
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    return new SeparatorController(args.document, {
      blade: args.blade,
      viewProps: args.viewProps
    });
  },
  api(args) {
    if (!(args.controller instanceof SeparatorController)) {
      return null;
    }
    return new SeparatorBladeApi(args.controller);
  }
};
var SliderBladePlugin = {
  id: "slider",
  type: "blade",
  core: VERSION$1,
  accept(params) {
    const result = parseRecord(params, (p) => ({
      max: p.required.number,
      min: p.required.number,
      view: p.required.constant("slider"),
      format: p.optional.function,
      label: p.optional.string,
      value: p.optional.number
    }));
    return result ? { params: result } : null;
  },
  controller(args) {
    var _a, _b;
    const initialValue = (_a = args.params.value) !== null && _a !== void 0 ? _a : 0;
    const drc = new DefiniteRangeConstraint({
      max: args.params.max,
      min: args.params.min
    });
    const v = createValue(initialValue, {
      constraint: drc
    });
    const vc = new SliderTextController(args.document, Object.assign(Object.assign({}, createSliderTextProps({
      formatter: (_b = args.params.format) !== null && _b !== void 0 ? _b : numberToString,
      keyScale: createValue(1),
      max: drc.values.value("max"),
      min: drc.values.value("min"),
      pointerScale: getSuitablePointerScale(args.params, initialValue)
    })), { parser: parseNumber, value: v, viewProps: args.viewProps }));
    return new LabeledValueBladeController(args.document, {
      blade: args.blade,
      props: ValueMap.fromObject({
        label: args.params.label
      }),
      value: v,
      valueController: vc
    });
  },
  api(args) {
    if (!(args.controller instanceof LabeledValueBladeController)) {
      return null;
    }
    if (!(args.controller.valueController instanceof SliderTextController)) {
      return null;
    }
    return new SliderBladeApi(args.controller);
  }
};
var TextBladePlugin = /* @__PURE__ */ (function() {
  return {
    id: "text",
    type: "blade",
    core: VERSION$1,
    accept(params) {
      const result = parseRecord(params, (p) => ({
        parse: p.required.function,
        value: p.required.raw,
        view: p.required.constant("text"),
        format: p.optional.function,
        label: p.optional.string
      }));
      return result ? { params: result } : null;
    },
    controller(args) {
      var _a;
      const v = createValue(args.params.value);
      const ic = new TextController(args.document, {
        parser: args.params.parse,
        props: ValueMap.fromObject({
          formatter: (_a = args.params.format) !== null && _a !== void 0 ? _a : ((v2) => String(v2))
        }),
        value: v,
        viewProps: args.viewProps
      });
      return new LabeledValueBladeController(args.document, {
        blade: args.blade,
        props: ValueMap.fromObject({
          label: args.params.label
        }),
        value: v,
        valueController: ic
      });
    },
    api(args) {
      if (!(args.controller instanceof LabeledValueBladeController)) {
        return null;
      }
      if (!(args.controller.valueController instanceof TextController)) {
        return null;
      }
      return new TextBladeApi(args.controller);
    }
  };
})();
function createDefaultWrapperElement(doc) {
  const elem = doc.createElement("div");
  elem.classList.add(ClassName("dfw")());
  if (doc.body) {
    doc.body.appendChild(elem);
  }
  return elem;
}
__name(createDefaultWrapperElement, "createDefaultWrapperElement");
function embedStyle(doc, id, css) {
  if (doc.querySelector(`style[data-tp-style=${id}]`)) {
    return;
  }
  const styleElem = doc.createElement("style");
  styleElem.dataset.tpStyle = id;
  styleElem.textContent = css;
  doc.head.appendChild(styleElem);
}
__name(embedStyle, "embedStyle");
var Pane = class extends RootApi {
  static {
    __name(this, "Pane");
  }
  constructor(opt_config) {
    var _a, _b;
    const config = opt_config !== null && opt_config !== void 0 ? opt_config : {};
    const doc = (_a = config.document) !== null && _a !== void 0 ? _a : getWindowDocument();
    const pool = createDefaultPluginPool();
    const rootController = new RootController(doc, {
      expanded: config.expanded,
      blade: createBlade(),
      props: ValueMap.fromObject({
        title: config.title
      }),
      viewProps: ViewProps.create()
    });
    super(rootController, pool);
    this.pool_ = pool;
    this.containerElem_ = (_b = config.container) !== null && _b !== void 0 ? _b : createDefaultWrapperElement(doc);
    this.containerElem_.appendChild(this.element);
    this.doc_ = doc;
    this.usesDefaultWrapper_ = !config.container;
    this.setUpDefaultPlugins_();
  }
  get document() {
    if (!this.doc_) {
      throw TpError.alreadyDisposed();
    }
    return this.doc_;
  }
  dispose() {
    const containerElem = this.containerElem_;
    if (!containerElem) {
      throw TpError.alreadyDisposed();
    }
    if (this.usesDefaultWrapper_) {
      const parentElem = containerElem.parentElement;
      if (parentElem) {
        parentElem.removeChild(containerElem);
      }
    }
    this.containerElem_ = null;
    this.doc_ = null;
    super.dispose();
  }
  registerPlugin(bundle) {
    if (bundle.css) {
      embedStyle(this.document, `plugin-${bundle.id}`, bundle.css);
    }
    const plugins = "plugin" in bundle ? [bundle.plugin] : "plugins" in bundle ? bundle.plugins : [];
    plugins.forEach((p) => {
      this.pool_.register(bundle.id, p);
    });
  }
  setUpDefaultPlugins_() {
    this.registerPlugin({
      id: "default",
      // NOTE: This string literal will be replaced with the default CSS by Rollup at the compilation time
      css: '.tp-tbiv_b,.tp-coltxtv_ms,.tp-colswv_b,.tp-ckbv_i,.tp-sglv_i,.tp-mllv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-rotv_b,.tp-fldv_b,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--bld-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--cnt-usz);line-height:var(--cnt-usz);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tbpv_c>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-vp))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tbpv_c>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--cnt-usp)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tbpv_c>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tbpv_c>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tbpv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tbpv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tbpv_c>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tbpv_c>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--bld-br);border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tbpv_c .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tbpv_c>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tbpv_c>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--bld-br)}.tp-tbpv_c .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--bld-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);overflow:hidden;padding-left:var(--cnt-hp);padding-right:calc(4px + var(--cnt-usz) + var(--cnt-hp));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-hp) + (var(--cnt-usz) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-vp);padding-top:var(--cnt-vp);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--cnt-usz);line-height:var(--cnt-usz);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-sglv_i,.tp-mllv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--mo-fg);height:var(--cnt-usz);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-sglv_i::-webkit-scrollbar,.tp-mllv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-sglv_i::-webkit-scrollbar-corner,.tp-mllv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-sglv_i::-webkit-scrollbar-thumb,.tp-mllv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-rotv{--bs-bg: var(--tp-base-background-color, hsl(230, 7%, 17%));--bs-br: var(--tp-base-border-radius, 6px);--bs-ff: var(--tp-base-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--bld-br: var(--tp-blade-border-radius, 2px);--bld-hp: var(--tp-blade-horizontal-padding, 4px);--bld-vw: var(--tp-blade-value-width, 160px);--btn-bg: var(--tp-button-background-color, hsl(230, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230, 7%, 75%));--cnt-hp: var(--tp-container-horizontal-padding, 4px);--cnt-vp: var(--tp-container-vertical-padding, 4px);--cnt-usp: var(--tp-container-unit-spacing, 4px);--cnt-usz: var(--tp-container-unit-size, 20px);--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--bld-br);cursor:pointer;display:block;height:var(--cnt-usz);position:relative;width:var(--cnt-usz)}.tp-ckbv_w svg{display:block;height:16px;inset:0;margin:auto;opacity:0;position:absolute;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--cnt-usz)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-expanded.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--cnt-usp);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--cnt-usp)}.tp-colpv_rgb{display:flex;margin-top:var(--cnt-usp);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-vp);padding-top:calc(var(--cnt-vp) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-hp));position:absolute;right:calc(-1*var(--cnt-hp));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--bld-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--cnt-usz)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{inset:0;position:absolute}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--bld-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;inset:0;position:absolute}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--bld-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{cursor:pointer;display:block;height:var(--cnt-usz);left:0;position:absolute;top:0;width:var(--cnt-usz)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--bld-br);content:"";display:block;inset:0;position:absolute}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--bld-br);color:var(--lbl-fg);cursor:pointer;height:var(--cnt-usz);line-height:var(--cnt-usz);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--cnt-usz)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-hp);padding-right:var(--cnt-hp)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:var(--bld-vw)}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 var(--bld-hp);width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--cnt-usz)*3);line-height:var(--cnt-usz);padding-left:var(--bld-hp);padding-right:var(--bld-hp);resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--cnt-usz);margin-right:4px;position:relative;width:var(--cnt-usz)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--cnt-usp);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-p2dpv{padding-left:calc(var(--cnt-usz) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:var(--bld-vw);padding:var(--cnt-vp) var(--cnt-hp);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--cnt-usz);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin:auto;position:absolute}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin-bottom:auto;margin-top:auto;position:absolute}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--bld-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--cnt-usz) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-hp) + 4px);padding-right:calc(var(--cnt-hp) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);content:"";inset:0 0 2px;pointer-events:none;position:absolute}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);opacity:.5;overflow:hidden;position:relative;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-tbpv_c{padding-bottom:var(--cnt-vp);padding-left:4px;padding-top:var(--cnt-vp)}.tp-txtv{position:relative}.tp-txtv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:calc(var(--bld-hp) - 5px);position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--cnt-usz) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--bld-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--bs-ff);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--cnt-usz) + var(--cnt-hp));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0;transition-delay:0s;transition-duration:0s}.tp-rotv.tp-rotv-not>.tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst.tp-fldv-expanded>.tp-fldv_b{transition-delay:0s;transition-duration:0s}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}',
      plugins: [
        ListBladePlugin,
        SeparatorBladePlugin,
        SliderBladePlugin,
        TabBladePlugin,
        TextBladePlugin
      ]
    });
  }
};
var VERSION = new Semver("4.0.5");

// src/main.ts
(/* @__PURE__ */ __name((function main() {
  WebGPUApp.Begin(class extends WebGPUApp {
    config;
    pane;
    viewButton = document.querySelector("#view-button");
    emojiButton = document.querySelector("#emoji-button");
    eraseButton = document.querySelector("#erase-button");
    clearButton = document.querySelector("#clear-button");
    emojiPicker = document.querySelector("emoji-picker");
    decalRotationInput = document.querySelector("#decalRotation");
    decalRotation = 0;
    currentEmojiTexture;
    currentEmojiBindGroup;
    stage = new Stage();
    camera;
    decal;
    spraycan;
    sponge;
    paintballGun;
    gltfLoader;
    mode = 0 /* View */;
    audioPlayer = new AudioPlayer();
    sprayClips = this.audioPlayer.loadClip("./media/sounds/spray.mp3").subClips([
      { offset: 0.2, duration: 0.5 },
      { offset: 1.6, duration: 0.8 },
      { offset: 4, duration: 0.5 }
    ]);
    eraseClips = this.audioPlayer.loadClip("./media/sounds/erase.mp3").subClips([
      { offset: 0.5, duration: 0.5 },
      { offset: 1.75, duration: 0.5 },
      { offset: 2.9, duration: 0.5 },
      { offset: 4.2, duration: 0.5 }
    ]);
    constructor(gpu) {
      super(gpu);
      this.config = Config.Create(AppConfig);
      this.pane = new Pane({
        title: document.title.split("-")[0]
      });
      this.pane.addButton({
        title: "Save"
      }).on("click", () => {
        const json = this.serializeDecalLayout();
        console.log("Serialized Decals: ", json);
        const blob = new Blob([json], { type: "text/json" });
        const link = document.createElement("a");
        link.download = "decalLayout.json";
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
        link.click();
        link.remove();
      });
      this.pane.addButton({
        title: "Load"
      }).on("click", () => {
        let input = document.createElement("input");
        input.type = "file";
        input.onchange = async () => {
          let file = input.files?.item(0);
          if (file) {
            this.deserializeDecalLayout(await file.text());
          }
        };
        input.click();
      });
      this.gltfLoader = new GltfLoader(gpu);
      const actorFromGltf = /* @__PURE__ */ __name((url) => {
        const actor = new Actor();
        this.gltfLoader.loadFromUrl(url).then((scene) => {
          actor.attachChild(scene);
        }).catch((err) => {
          console.error("Gltf failed to load.", err);
        });
        return actor;
      }, "actorFromGltf");
      this.stage.attachChild(actorFromGltf("./media/models/gallery.glb"));
      this.spraycan = actorFromGltf("./media/models/spraypaint_can.glb");
      this.spraycan.transform.translation = [0.25, -0.75, -0.5];
      this.spraycan.transform.rotationRef.rotateY(Math.PI);
      this.sponge = actorFromGltf("./media/models/sponge.glb");
      this.sponge.transform.translation = [0.25, -0.75, -0.5];
      this.sponge.transform.rotationRef.rotateY(Math.PI * -0.33);
      this.paintballGun = actorFromGltf("./media/models/paintball_gun.glb");
      this.paintballGun.transform.translation = [0.3, -0.6, -0.5];
      this.paintballGun.transform.rotationRef.rotateY(Math.PI);
      gpu.textureLoader.fromUrl("./media/environment/industrial_pipe_and_valve_ibl.ktx").then((texture) => {
        gpu.environmentTexture = texture;
      });
      this.loadDecalLayoutFromUrl("./media/decalLayout.json");
      const controller = new FlyingController(gpu.canvas);
      controller.speed = 4e-3;
      this.camera = new Actor(
        new PerspectiveCamera({ zNear: 0.01 }),
        controller
      );
      this.camera.transform.translation = [0.2, 1.6, 2];
      this.stage.attachChild(this.camera);
      this.decal = new Actor(
        new Decal({}, 0),
        Tag("placing-decal")
      );
      this.decal.transform.translation = [0, 0, 0];
      this.decalRotationInput.addEventListener("input", (ev) => {
        this.decalRotation = this.decalRotationInput.value * (Math.PI / 180);
        this.decal.transform.rotationRef.identity();
        this.decal.transform.rotationRef.rotateZ(this.decalRotation);
      });
      gpu.canvas.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        if (this.mode == 1 /* Paint */) {
          const curDecal = this.decal.get(Decal);
          if (curDecal) {
            this.audioPlayer.play(this.sprayClips[Math.floor(Math.random() * this.sprayClips.length)]);
            this.decal.remove(Tag("placing-decal"));
            this.decal.transform = this.decal.worldTransform;
            this.stage.attachChild(this.decal);
          }
          this.decal = new Actor(curDecal, Tag("placing-decal"));
          this.decal.transform.rotationRef.rotateZ(this.decalRotation);
          setTimeout(() => {
            if (this.mode == 1 /* Paint */) {
              this.camera.attachChild(this.decal);
            }
          }, this.config.sprayCooldown);
        } else if (this.mode == 2 /* Erase */) {
          let decalIndex = 1;
          this.stage.query(Decal).forEach((actor) => {
            if (decalIndex == this.lastSelectedDecal) {
              this.audioPlayer.play(this.eraseClips[Math.floor(Math.random() * this.eraseClips.length)]);
              actor.parent?.removeChild(actor);
              this.lastSelectedDecal = 0;
              this.gpu.decalManager.selectedDecal = 0;
              return false;
            }
            decalIndex++;
          });
        }
        return false;
      });
      gpu.canvas.addEventListener("click", (ev) => {
        this.emojiPicker.style.display = "none";
      });
      this.emojiPicker = document.querySelector("emoji-picker");
      this.emojiPicker.addEventListener("emoji-click", (event) => {
        const emojiEvent = event;
        this.onEmojiPicked(emojiEvent.detail);
      });
      fetch("./media/emoji/custom.json").then(async (result) => {
        this.emojiPicker.customEmoji = await result.json();
      });
      this.viewButton.addEventListener("click", () => {
        this.#switchMode(0 /* View */);
      });
      this.emojiButton.addEventListener("click", () => {
        this.#switchMode(1 /* Paint */);
      });
      this.eraseButton.addEventListener("click", () => {
        this.#switchMode(2 /* Erase */);
      });
      this.clearButton.addEventListener("click", () => {
        this.clearDecals();
      });
      this.onEmojiPicked(this.config.emoji);
      this.gpu.canvas.addEventListener("mousemove", async (ev) => {
        if (this.mode == 2 /* Erase */) {
          this.getSelectedDecal(
            gpu,
            Math.floor(ev.clientX * devicePixelRatio),
            Math.floor(ev.clientY * devicePixelRatio)
          );
        }
      });
      this.#switchMode(0 /* View */);
    }
    #switchMode(mode) {
      this.mode = mode;
      this.gpu.decalManager.selectedDecal = 0;
      switch (this.mode) {
        case 0 /* View */:
          this.viewButton.classList.add("selected");
          this.emojiButton.classList.remove("selected");
          this.eraseButton.classList.remove("selected");
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          this.emojiPicker.style.display = "none";
          break;
        case 1 /* Paint */:
          this.viewButton.classList.remove("selected");
          this.emojiButton.classList.add("selected");
          this.eraseButton.classList.remove("selected");
          this.camera.attachChild(this.decal);
          this.camera.attachChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          if (this.emojiPicker.style.display === "none") {
            this.emojiPicker.style.display = "";
          } else {
            this.emojiPicker.style.display = "none";
          }
          break;
        case 2 /* Erase */:
          this.viewButton.classList.remove("selected");
          this.emojiButton.classList.remove("selected");
          this.eraseButton.classList.add("selected");
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.attachChild(this.sponge);
          this.camera.removeChild(this.paintballGun);
          this.emojiPicker.style.display = "none";
          break;
        case 3 /* Shoot */:
          this.viewButton.classList.remove("selected");
          this.emojiButton.classList.remove("selected");
          this.eraseButton.classList.add("selected");
          this.camera.removeChild(this.decal);
          this.camera.removeChild(this.spraycan);
          this.camera.removeChild(this.sponge);
          this.camera.attachChild(this.paintballGun);
          this.emojiPicker.style.display = "none";
          break;
      }
    }
    clearDecals() {
      this.stage.query(Decal).forEach((actor) => {
        if (!actor.has(Tag("placing-decal"))) {
          actor.parent?.removeChild(actor);
        }
      });
    }
    async loadDecalLayoutFromUrl(url) {
      const response = await fetch(url);
      this.deserializeDecalLayoutFromJson(await response.json());
    }
    deserializeDecalLayoutFromString(json) {
      const decalLayout = JSON.parse(json);
      this.deserializeDecalLayoutFromJson(decalLayout);
    }
    async deserializeDecalLayoutFromJson(decalLayout) {
      this.clearDecals();
      if (decalLayout.version != 1) {
        throw new Error(`Unsupported DecalLayout version: ${decalLayout.version}`);
      }
      for (const decal of decalLayout.decals) {
        const emoji = decalLayout.emoji[decal.emojiIndex];
        const actor = new Actor(await this.gpu.decalManager.getDecal(emoji));
        actor.transform.translation = decal.translation;
        actor.transform.rotation = decal.rotation;
        this.stage.attachChild(actor);
      }
    }
    serializeDecalLayout() {
      const decalLayout = {
        version: 1,
        emoji: [],
        decals: []
      };
      this.stage.query(Decal).forEach((actor, decal) => {
        if (actor.has(Tag("placing-decal"))) {
          return;
        }
        if (!decalLayout.emoji[decal.textureIndex]) {
          decalLayout.emoji[decal.textureIndex] = decal.emoji;
        }
        decalLayout.decals.push({
          emojiIndex: decal.textureIndex,
          translation: [...actor.worldTransform.translation],
          rotation: [...actor.worldTransform.rotation]
        });
      });
      return JSON.stringify(decalLayout);
    }
    async onEmojiPicked(emoji) {
      console.log(emoji);
      this.config.emoji = emoji;
      this.decal.add(await this.gpu.decalManager.getDecal(emoji));
      if (emoji.unicode) {
        this.emojiButton.innerHTML = emoji.unicode;
        this.emojiButton.style = "";
      } else {
        this.emojiButton.innerHTML = "&nbsp;";
        this.emojiButton.style = `background-image: url("${emoji.emoji.url}")`;
      }
      this.emojiPicker.style.display = "none";
    }
    lastSelectedDecal = 0;
    centerX = 0;
    centerY = 0;
    async getSelectedDecal(gpu, x, y) {
      const decalId = await gpu.selectionManager.getDecalIdAtPoint(x, y);
      if (decalId != this.lastSelectedDecal) {
        this.lastSelectedDecal = decalId;
        this.gpu.decalManager.selectedDecal = decalId;
      }
      return decalId;
    }
    onResize(gpu, width, height) {
      this.centerX = Math.floor(width * 0.5);
      this.centerY = Math.floor(height * 0.5);
      this.camera.get(PerspectiveCamera).aspect = width / height;
    }
    onFrame(gpu, timestamp, delta) {
      this.stage.tick(timestamp);
      gpu.render(this.stage, this.camera, timestamp);
    }
  }, {
    canvas: document.querySelector("#webgpu-canvas")
  });
}), "main"))();
/*! Bundled license information:

tweakpane/dist/tweakpane.js:
  (*! Tweakpane 4.0.5 (c) 2016 cocopon, licensed under the MIT license. *)
*/
//# sourceMappingURL=main.js.map
