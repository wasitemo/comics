// MAIN QUERY
export const getBlog = async (db, limit, offset) => {
  const query = await db.query(
    `
        SELECT
        blog_id,
        account_id,
        blog_title,
        blog_content,
        blog_image_url,
        create_at
        FROM blog
        ORDER BY blog_id ASC
        LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  );
  const result = query.rows;

  return result;
};

export const getBlogById = async (db, blogId) => {
  const query = await db.query(
    `
        SELECT
        blog_id,
        account_id,
        blog_title,
        blog_content,
        blog_image_id,
        blog_image_url,
        create_at
        FROM blog
        WHERE blog_id = $1
    `,
    [blogId],
  );
  const result = query.rows[0];

  return result;
};

export const addBlog = async (db, accountId, blogTitle, blogContent) => {
  const query = await db.query(
    `
        INSERT INTO blog
        (account_id, blog_title, blog_content)
        VALUES
        ($1, $2, $3)
        RETURNING blog_id
    `,
    [accountId, blogTitle, blogContent],
  );
  const result = query.rows[0];

  return result;
};

export const updateBlogImage = async (
  db,
  blogImageId,
  blogImageUrl,
  blogId,
) => {
  await db.query(
    `
    UPDATE blog
    SET
    blog_image_id = $1,
    blog_image_url = $2
    WHERE blog_id = $3
  `,
    [blogImageId, blogImageUrl, blogId],
  );
};

export const updateBlog = async (db, data, blogId) => {
  const { account_id, blog_title, blog_content } = data;

  const query = await db.query(
    `
        UPDATE blog
        SET
        account_id = $1,
        blog_title = $2,
        blog_content = $3
        WHERE blog_id = $4
        RETURNING blog_id
    `,
    [account_id, blog_title, blog_content, blogId],
  );
  const result = query.rows[0];

  return result;
};

export const deleteBlog = async (db, blogId) => {
  await db.query("DELETE FROM blog WHERE blog_id = $1", [blogId]);
};

// UTIL QUERY
export const getTotalBlog = async (db) => {
  const query = await db.query(`
        SELECT COUNT(*)
        FROM (
            SELECT
            blog_id,
            account_id,
            blog_title,
            blog_content,
            blog_image_url,
            create_at
            FROM blog
        )
    `);
  const result = query.rows[0];

  return result;
};
