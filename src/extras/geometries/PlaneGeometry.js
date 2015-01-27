/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */
/*
///PlaneGeometry用来在三维空间内创建一个平面对象.
///
///	用法: var geometry = new THREE.PlaneGeometry(5,5,20,32);	
/// 	  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/// 	  var plane = new THREE.Mesh(geometry,material);
/// 	  scene.add(plane);
*/
///<summary>PlaneGeometry</summary>
///<param name ="width" type="float">平面的高度</param>
///<param name ="height" type="float">平面的宽度</param>
///<param name ="widthSegments" type="int">对象的宽方向的细分线段数</param>
///<param name ="heightSegments" type="int">对象的高方向的细分线段数</param>
THREE.PlaneGeometry = function ( width, height, widthSegments, heightSegments ) {

	THREE.Geometry.call( this );

	this.parameters = {
		width: width,		//平面的高度
		height: height,		//平面的宽度
		widthSegments: widthSegments,		//对象的宽方向的细分线段数
		heightSegments: heightSegments		//对象的高方向的细分线段数
	};

	//高度,宽度的一半,设置平面对象的放置点,为中心点.
	var ix, iz;
	var width_half = width / 2;
	var height_half = height / 2;

	var gridX = widthSegments || 1;
	var gridZ = heightSegments || 1;

	var gridX1 = gridX + 1;
	var gridZ1 = gridZ + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridZ;

	var normal = new THREE.Vector3( 0, 0, 1 );	//设置法线方向.
	//下面这两段算法还是先计算出所有的顶点,三角面,uv索引顺序,
	for ( iz = 0; iz < gridZ1; iz ++ ) {

		var y = iz * segment_height - height_half;

		for ( ix = 0; ix < gridX1; ix ++ ) {

			var x = ix * segment_width - width_half;

			this.vertices.push( new THREE.Vector3( x, - y, 0 ) );

		}

	}

	for ( iz = 0; iz < gridZ; iz ++ ) {

		for ( ix = 0; ix < gridX; ix ++ ) {

			var a = ix + gridX1 * iz;
			var b = ix + gridX1 * ( iz + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iz + 1 );
			var d = ( ix + 1 ) + gridX1 * iz;

			var uva = new THREE.Vector2( ix / gridX, 1 - iz / gridZ );
			var uvb = new THREE.Vector2( ix / gridX, 1 - ( iz + 1 ) / gridZ );
			var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iz + 1 ) / gridZ );
			var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iz / gridZ );

			var face = new THREE.Face3( a, b, d );
			face.normal.copy( normal );
			face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );

			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

			face = new THREE.Face3( b, c, d );
			face.normal.copy( normal );
			face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );

			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

		}

	}

};
/*************************************************
****下面是PlaneGeometry对象的方法属性定义,继承自Geometry对象.
**************************************************/
THREE.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
