/**
* Utilities operating on Vector3 objects. All methods are static and do not modify the input objects.
*
* @public
*/
export class Vector3Utils {
    /**
     * equals
     *
     * Check the equality of two vectors
     */
    static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    /**
     * add
     *
     * Add two vectors to produce a new vector
     */
    static add(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
    }
    /**
     * subtract
     *
     * Subtract two vectors to produce a new vector (v1-v2)
     */
    static subtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
    }
    /** scale
     *
     * Multiple all entries in a vector by a single scalar value producing a new vector
     */
    static scale(v1, scale) {
        return { x: v1.x * scale, y: v1.y * scale, z: v1.z * scale };
    }
    /**
     * dot
     *
     * Calculate the dot product of two vectors
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    /**
     * cross
     *
     * Calculate the cross product of two vectors. Returns a new vector.
     */
    static cross(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
    }
    /**
     * magnitude
     *
     * The magnitude of a vector
     */
    static magnitude(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    }
    /**
     * distance
     *
     * Calculate the distance between two vectors
     */
    static distance(a, b) {
        return Vector3Utils.magnitude(Vector3Utils.subtract(a, b));
    }
    /**
     * normalize
     *
     * Takes a vector 3 and normalizes it to a unit vector
     */
    static normalize(v) {
        const mag = Vector3Utils.magnitude(v);
        return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
    }
    /**
     * floor
     *
     * Floor the components of a vector to produce a new vector
     */
    static floor(v) {
        return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
    }
    /**
     * toString
     *
     * Create a string representation of a vector3
     */
    static toString(v, options) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
        return str.join(options?.delimiter ?? ', ');
    }
    /**
     * clamp
     *
     * Clamps the components of a vector to limits to produce a new vector
     */
    static clamp(v, limits) {
        return {
            x: (0, clamp_1.clampNumber)(v.x, limits?.min?.x ?? Number.MIN_SAFE_INTEGER, limits?.max?.x ?? Number.MAX_SAFE_INTEGER),
            y: (0, clamp_1.clampNumber)(v.y, limits?.min?.y ?? Number.MIN_SAFE_INTEGER, limits?.max?.y ?? Number.MAX_SAFE_INTEGER),
            z: (0, clamp_1.clampNumber)(v.z, limits?.min?.z ?? Number.MIN_SAFE_INTEGER, limits?.max?.z ?? Number.MAX_SAFE_INTEGER),
        };
    }
    /**
     * lerp
     *
     * Constructs a new vector using linear interpolation on each component from two vectors.
     */
    static lerp(a, b, t) {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
            z: a.z + (b.z - a.z) * t,
        };
    }
    /**
     * slerp
     *
     * Constructs a new vector using spherical linear interpolation on each component from two vectors.
     */
    static slerp(a, b, t) {
        const theta = Math.acos(Vector3Utils.dot(a, b));
        const sinTheta = Math.sin(theta);
        const ta = Math.sin((1.0 - t) * theta) / sinTheta;
        const tb = Math.sin(t * theta) / sinTheta;
        return Vector3Utils.add(Vector3Utils.scale(a, ta), Vector3Utils.scale(b, tb));
    }
    /**
     * multiply
     *
     * Element-wise multiplication of two vectors together.
     * Not to be confused with {@link Vector3Utils.dot} product or {@link Vector3Utils.cross} product
     */
    static multiply(a, b) {
        return {
            x: a.x * b.x,
            y: a.y * b.y,
            z: a.z * b.z,
        };
    }
    /**
     * rotateX
     *
     * Rotates the vector around the x axis counterclockwise (left hand rule)
     * @param a - Angle in radians
     */
    static rotateX(v, a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return {
            x: v.x,
            y: v.y * cos - v.z * sin,
            z: v.z * cos + v.y * sin,
        };
    }
    /**
     * rotateY
     *
     * Rotates the vector around the y axis counterclockwise (left hand rule)
     * @param a - Angle in radians
     */
    static rotateY(v, a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return {
            x: v.x * cos + v.z * sin,
            y: v.y,
            z: v.z * cos - v.x * sin,
        };
    }
    /**
     * rotateZ
     *
     * Rotates the vector around the z axis counterclockwise (left hand rule)
     * @param a - Angle in radians
     */
    static rotateZ(v, a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return {
            x: v.x * cos - v.y * sin,
            y: v.y * cos + v.x * sin,
            z: v.z,
        };
    }
}